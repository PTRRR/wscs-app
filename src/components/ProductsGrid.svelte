<script lang="ts">
	import type { Product } from '../utilities/api/types';

	const props: {
		products: Product[];
	} = $props();
</script>

<div class="products-grid">
	{#each props.products as product}
		<div class="products-grid__item">
			<a class="products-grid__image" href={`/products/${product.id}`} aria-label="Product image">
				<div class="products-grid__image-content"></div>
			</a>
			<div class="products-grid__footer">
				<span>{product.title}</span>
				<button aria-label="Add to cart">Add to cart</button>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-gap: 0rem;
		padding: 1rem;

		&__item {
			padding: 1rem;
		}

		&__image {
			display: block;
			width: 100%;
			padding-top: 100%;
			position: relative;
		}

		&__image-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: lightgray;
		}

		&__footer {
			padding-top: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;

			button {
				cursor: pointer;
			}
		}
	}
</style>
