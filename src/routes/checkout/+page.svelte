<script lang="ts">
	import { onMount } from 'svelte';
	import { useCart } from '../../store';
	import { WSCS } from '../../utilities/api';
	import type { Product, Variation } from '../../utilities/api/types';
	import { filterDuplicate } from '../../utilities/iterables';
	import type { PageData } from './$types';

	export let data: PageData;

	const { cart, removeFromCart } = useCart();

	let loadingCart: boolean = true;
	let products: Product[] = [];
	let variations: Variation[] = [];

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

	onMount(() => {
		const unsubscribe = cart.subscribe((cart) => {
			loadingCart = true;
			const productIds = cart.items.map((item) => item.productId).filter(filterDuplicate);
			const variationIds = cart.items.map((item) => item.variationId).filter(filterDuplicate);

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
							on:click={() => removeFromCart({ productId: product.id, variationId: variation.id })}
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
