<script lang="ts">
	import { useCart } from '../../store';
	import { WSCS } from '../../utilities/api';
	import type { Product, Variation } from '../../utilities/api/types';
	import { filterDuplicate } from '../../utilities/iterables';

	const { cart } = useCart();

	let loadingCart: boolean = false;
	let products: Product[] = [];
	let variations: Variation[] = [];

	const api = new WSCS();

	$: {
		loadingCart = true;
		const productIds = $cart.items.map((item) => item.productId).filter(filterDuplicate);
		const variationIds = $cart.items.map((item) => item.variationId).filter(filterDuplicate);

		Promise.all([
			api
				.findVariations({
					id: { in: variationIds.join(',') }
				})
				.then(({ docs }) => (variations = docs)),
			api
				.findProducts({
					id: { in: productIds.join(',') }
				})
				.then(({ docs }) => (products = docs))
		]).then(() => (loadingCart = false));
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
</script>

<h1>Checkout</h1>

{#if loadingCart}
	<span>Loading cart...</span>
{:else}
	{#each products as product}
		<div class="cart-item">
			<p>{product.title}</p>
			{#each getVariationsForProduct(product) as variation}
				<p>{variation.name}</p>
			{/each}
			<p>Price: {getProductTotal(product)}€</p>
		</div>
	{/each}
{/if}
