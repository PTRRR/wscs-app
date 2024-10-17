<script lang="ts">
	import { onMount } from 'svelte';
	import { useCart } from '../../store';
	import { WSCS } from '../../utilities/api';
	import type { Product, Variation } from '../../utilities/api/types';
	import { filterDuplicate } from '../../utilities/iterables';

	const { cart } = useCart();

	let mounted: boolean = false;
	let loadingCart: boolean = true;
	let products: Product[] = [];
	let variations: Variation[] = [];

	const api = new WSCS();

	$: {
		if (mounted) {
			loadingCart = true;
			const productIds = $cart.items.map((item) => item.productId).filter(filterDuplicate);
			const variationIds = $cart.items.map((item) => item.variationId).filter(filterDuplicate);

			Promise.all([
				api
					.findVariations({
						depth: 0,
						query: { id: { in: variationIds.join(',') } }
					})
					.then(({ docs }) => (variations = docs || [])),
				api
					.findProducts({
						depth: 0,
						query: { id: { in: productIds.join(',') } }
					})
					.then(({ docs }) => (products = docs || []))
			]).then(() => (loadingCart = false));
		}
	}

	$: getVariationsForProduct = (product: Product) => {
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
		mounted = true;
	});
</script>

<svelte:head>
	<title>Checkout</title>
</svelte:head>

<h1>Checkout</h1>

{#if loadingCart}
	<span>Loading cart...</span>
{:else}
	{#if products.length === 0}
		<span>Nothing in the cart</span>
	{/if}

	{#each products as product}
		<div class="cart-item">
			<a href={`/products/${product.id}`}>{product.title}</a>
			{#each getVariationsForProduct(product) as variation}
				<p>{variation.name}</p>
			{/each}
			<p>Price: {getProductTotal(product)}€</p>
		</div>
	{/each}

	<p>TOTAL: {total}€</p>
{/if}
