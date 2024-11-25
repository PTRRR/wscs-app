<script lang="ts">
	import { useLocalCart } from '../store';
	import type { Product } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import Image from './Image.svelte';

	const props: {
		products: Product[];
		baseUrl?: string;
	} = $props();

	const { cart, addToCart, removeFromCart } = useLocalCart();

	const isInCart = (productId: number) => $cart.items.some((it) => it.product === productId);

	const products = $derived.by(() => {
		return props.products.map((product) => {
			const productVariations = product.variations?.docs || [];
			const defaultVariation =
				productVariations
					.map(getApiObject)
					.filter(filterNullish)
					.find((it) => it.isDefault) || getApiObject(productVariations[0]);

			const image = getApiObject(defaultVariation?.image);
			const src = image?.sizes?.smallWebp?.url || image?.url;
			const alt = image?.alt;
			const srcsets = [
				{ src: image?.sizes?.smallWebp?.url || '' },
				{ src: image?.sizes?.small?.url || '' },
				{ src: image?.sizes?.mediumWebp?.url || '' },
				{ src: image?.sizes?.medium?.url || '' }
			];

			return {
				id: product.id,
				title: product.title,
				image: { src, srcsets, alt },
				variationId: defaultVariation?.id
			};
		});
	});
</script>

<div class="products-grid">
	{#each products as product}
		<div class="products-grid__item">
			<a class="products-grid__image" href={`/products/${product.id}`} aria-label="Product image">
				<div class="products-grid__image-content">
					{#if product.image.src}
						{#key product.image.src}
							<Image
								baseUrl={props.baseUrl}
								src={product.image.src}
								srcsets={product.image.srcsets}
								alt={product.image.alt}
							/>
						{/key}
					{:else}
						<span>No image</span>
					{/if}
				</div>
			</a>
			<div class="products-grid__footer">
				<span>{product.title}</span>

				{#if typeof product.variationId === 'number'}
					<button
						aria-label="Add to cart"
						onclick={() => {
							if (typeof product.variationId !== 'number') return;
							if (!isInCart(product.id)) {
								addToCart({
									product: product.id,
									variation: product.variationId,
									quantity: 1
								});
							} else {
								removeFromCart({
									product: product.id,
									variation: product.variationId
								});
							}
						}}
					>
						{isInCart(product.id) ? 'Remove from cart' : 'Add to cart'}
					</button>
				{/if}
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
			display: flex;
			flex-direction: column;
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
			display: flex;
			align-items: center;
			justify-content: center;

			:global(picture) {
				width: 100%;
				height: 100%;
				border: none;
				object-fit: contain;
			}
		}

		&__footer {
			padding-top: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;
			height: 100%;
			flex: 1 1 auto;
			justify-content: space-between;

			button {
				cursor: pointer;
			}
		}
	}
</style>
