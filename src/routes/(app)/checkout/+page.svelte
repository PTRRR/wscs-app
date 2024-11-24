<script lang="ts">
	import { onMount } from 'svelte';
	import { useLocalCart, useUser } from '../../../store';
	import { WSCS } from '../../../utilities/api';
	import type { Product, Variation } from '../../../utilities/api/types';
	import { filterDuplicate } from '../../../utilities/iterables';
	import type { PageData } from './$types';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement, LinkAuthenticationElement } from 'svelte-stripe';
	import type { StripeElements } from '@stripe/stripe-js/dist/stripe-js';
	import { goto } from '$app/navigation';

	const props: { data: PageData } = $props();
	const { data } = props;

	const { query: user } = useUser(data.api.baseUrl);
	const { cart } = useLocalCart();

	let loadingCart: boolean = $state(true);
	let products: Product[] = $state([]);
	let variations: Variation[] = $state([]);
	let processing: boolean = $state(false);

	const api = new WSCS(data.api.baseUrl);

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
		loadStripe(data.stripe.publicKey).then((res) => (stripe = res));
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

			Promise.all([
				api.findVariations({
					depth: 0,
					query: { id: { in: variationIds.join(',') } }
				}),
				api.findProducts({
					depth: 0,
					query: { id: { in: productIds.join(',') } }
				})
			]).then(([{ docs: _variations }, { docs: _products }]) => {
				variations = _variations || [];
				products = _products || [];
				loadingCart = false;
			});
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<title>Checkout</title>
</svelte:head>

<div class="checkout">
	<h1>Checkout</h1>

	<div class="checkout__columns">
		{#if !$user.data?.user && $user.isFetched}
			<p>Please <a href="/login">login</a> in order to checkout</p>
		{:else if $user.isFetched}
			{#if products.length === 0 && !loadingCart}
				<span>Nothing in the cart</span>
			{:else}
				<div class="checkout__column">
					{#each products as product}
						{#key product.id}
							<div class="checkout__cart-item">
								<a href={`/products/${product.id}`}>{product.title}</a>
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
			{/if}

			<div class="checkout__column">
				{#if stripe && clientSecret && !processing && !paymentIntentError}
					<form
						onsubmit={async (e) => {
							e.preventDefault();
							try {
								const userData = $user.data?.user;
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
											email: $user.data?.user?.email
										}
									}
								}}
							/>
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
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.checkout {
		h1 {
			padding: 1rem;
			margin: 0;
		}

		p {
			margin: 0;
		}

		&__columns {
			display: flex;
		}

		&__column {
			width: 50%;
			padding: 1rem;
		}

		&__cart-item {
			margin-bottom: 1rem;
		}
	}
</style>
