<script lang="ts">
	import AddToCartButton from '../components/AddToCartButton.svelte';
	import type { Product, Variation } from '../utilities/api/types';
	import type { PageData } from './$types';

	export let data: PageData;

	const getFirstProductVariation = (product: Product): Variation[] => {
		if (product.variations && product.variations?.length > 0) {
			const variation = product.variations[0];
			if (typeof variation !== 'number') {
				return [variation];
			}
		}

		return [];
	};
</script>

<h1>sdflkjh</h1>

{#each data.products as product}
	<div class="product">
		<a href={`/products/${product.id}`}>
			<h2>{product.title}</h2>
		</a>

		{#each getFirstProductVariation(product) as variation}
			<AddToCartButton productId={product.id} variationId={variation.id} />
		{/each}
	</div>
{/each}
