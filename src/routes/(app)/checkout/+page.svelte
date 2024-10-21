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

	export let data: PageData;

	const { query: user } = useUser(data.api.baseUrl);
	const { cart, removeFromCart } = useLocalCart();

	let loadingCart: boolean = true;
	let products: Product[] = [];
	let variations: Variation[] = [];
	let processing: boolean = false;

	const api = new WSCS(data.api.baseUrl);

	const getVariationsForProduct = (product: Product) => {
		return variations.filter((it) =>
			(product.variations || [])
				.map((variation) => (typeof variation === 'number' ? variation : variation.id))
				.includes(it.id)
		);
	};

	$: getProductTotal = (product: Product) =>
		getVariationsForProduct(product).reduce((acc, variation) => {
			return (acc += variation?.price || 0);
		}, 0);

	$: total = products.reduce((acc, product) => {
		return (acc += getProductTotal(product));
	}, 0);

	let elements: StripeElements;
	let stripe: Stripe | null = null;
	let clientSecret: string | undefined = undefined;

	onMount(() => {
		loadStripe(data.stripe.publicKey).then((res) => (stripe = res));
		api.createPayementIntent().then((res) => (clientSecret = res.client_secret));

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

<h1>Checkout</h1>

{#if products.length === 0 && !loadingCart}
	<span>Nothing in the cart</span>
{:else}
	{#each products as product}
		{#key product.id}
			<div class="cart-item">
				<a href={`/products/${product.id}`}>{product.title}</a>
				{#each getVariationsForProduct(product) as variation}
					{#key variation.id}
						<p>{variation.name}</p>
						<button
							on:click={() => removeFromCart({ product: product.id, variation: variation.id })}
						>
							Remove from cart
						</button>
					{/key}
				{/each}
				<p>Price: {getProductTotal(product)}€</p>
			</div>
		{/key}
	{/each}
{/if}

{#if loadingCart}
	<span>Loading cart...</span>
{:else}
	<p>TOTAL: {total}€</p>
{/if}

{#if stripe && clientSecret && !processing}
	<form
		on:submit|preventDefault={async () => {
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
{:else if stripe && clientSecret && !processing}
	<p>Processing payment...</p>
{/if}
