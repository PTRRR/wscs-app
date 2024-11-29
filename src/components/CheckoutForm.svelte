<script lang="ts">
	import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { useLocalCart } from '../store';
	import type { Product, User, Variation } from '../utilities/api/types';
	import { WSCS } from '../utilities/api';
	import { filterDuplicate, filterNullish } from '../utilities/iterables';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from 'svelte-stripe';
	import { goto } from '$app/navigation';

	const props: {
		baseUrl: string;
		stripePublicKey: string;
		user: User;
	} = $props();

	const { cart } = useLocalCart();

	let loadingCart: boolean = $state(true);
	let products: Product[] = $state([]);
	let variations: Variation[] = $state([]);
	let processing: boolean = $state(false);

	const api = new WSCS(props.baseUrl);

	const getVariationsForProduct = (product: Product) => {
		return variations.filter((it) =>
			(product.variations?.docs || [])
				.map((variation) => (typeof variation === 'number' ? variation : variation.id))
				.includes(it.id)
		);
	};

	const getProductTotal = $derived.by(
		() => (product: Product) =>
			getVariationsForProduct(product).reduce((acc, variation) => {
				return (acc += variation?.price || 0);
			}, 0)
	);

	const total = $derived(
		products.reduce((acc, product) => {
			return (acc += getProductTotal(product));
		}, 0)
	);

	let elements: StripeElements | undefined = $state(undefined);
	let stripe: Stripe | null = $state(null);
	let clientSecret: string | undefined = $state(undefined);
	let paymentIntentError: string | undefined = $state(undefined);

	onMount(() => {
		loadStripe(props.stripePublicKey).then((res) => (stripe = res));
		api
			.createPayementIntent()
			.then((res) => (clientSecret = res.client_secret))
			.catch((res) => {
				console.log(res.message);
				paymentIntentError =
					res.message || 'There was an error creating the payment. Please try again later.';
			});

		const unsubscribe = cart.subscribe((cart) => {
			loadingCart = true;
			const productIds = cart.items.map((item) => item.product).filter(filterDuplicate);
			const variationIds = cart.items.map((item) => item.variation).filter(filterDuplicate);

			const variationsPromise =
				variationIds.length > 0
					? api
							.findVariations({
								depth: 0,
								query: { id: { in: variationIds.join(',') } }
							})
							.then(({ docs: _variations }) => (variations = _variations || []))
					: undefined;

			const productsPromise =
				productIds.length > 0
					? api
							.findProducts({
								depth: 0,
								query: { id: { in: productIds.join(',') } }
							})
							.then(({ docs: _products }) => (products = _products || []))
					: undefined;

			Promise.all([variationsPromise, productsPromise].filter(filterNullish)).then(() => {
				loadingCart = false;
			});
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="checkout-form">
	<div class="checkout-form__columns">
		{#if products.length === 0 && !loadingCart}
			<span>Nothing in the cart</span>
		{:else}
			<div class="checkout-form__column">
				{#each products as product}
					{#key product.id}
						<div class="checkout-form__cart-item">
							<a href={`/products/${product.slug}`}>{product.title}</a>
							{#each getVariationsForProduct(product) as variation}
								{#key variation.id}
									<p>{variation.name}</p>
								{/key}
							{/each}
							<p>Price: {getProductTotal(product)}€</p>
						</div>
					{/key}
				{/each}

				{#if loadingCart}
					<span>Loading cart...</span>
				{:else}
					<p>TOTAL: {total}€</p>
				{/if}
			</div>

			<div class="checkout-form__column">
				{#if stripe && clientSecret && !processing && !paymentIntentError}
					<form
						onsubmit={async (e) => {
							e.preventDefault();
							try {
								const userData = props.user;
								if (stripe && elements && userData) {
									const result = await stripe.confirmPayment({
										elements,
										redirect: 'if_required'
									});

									if (result.error) {
										console.log(result.error);
										return;
									}

									if (result.paymentIntent?.status === 'succeeded') {
										$cart = { items: [] };
										goto('/payment-confirmation');
									}
								}
							} catch (error) {
								console.log(error);
							} finally {
								processing = false;
							}
						}}
					>
						<Elements {stripe} {clientSecret} theme="flat" bind:elements>
							<LinkAuthenticationElement />
							<PaymentElement
								options={{
									defaultValues: {
										billingDetails: {
											email: props.user.email
										}
									}
								}}
							/>
							<h2>Address</h2>
							<Address mode="billing" autocomplete={{ mode: 'automatic' }} />
						</Elements>

						<button type="submit">Pay</button>
					</form>
				{:else if paymentIntentError}
					<p>Error:</p>
					<p>{paymentIntentError}</p>
				{:else if stripe && clientSecret && !processing}
					<p>Processing payment...</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.checkout-form {
		&__columns {
			display: flex;
		}

		&__column {
			flex: 1 1 auto;
			width: 50%;
		}
	}
</style>
