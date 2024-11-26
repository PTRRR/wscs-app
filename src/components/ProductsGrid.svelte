<script lang="ts">
	import { useLocalCart } from '../store';
	import type { Product } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { css } from '../utilities/css';
	import { filterNullish } from '../utilities/iterables';
	import Button from './Button.svelte';
	import Image from './Image.svelte';

	const props: {
		products: Product[];
		baseUrl?: string;
		onloadmore?: () => void;
		isLoading?: boolean;
		size?: string;
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
				{
					src: image?.sizes?.thumbnailWebp?.url || '',
					minWidth: image?.sizes?.thumbnailWebp?.width
				},
				{ src: image?.sizes?.thumbnail?.url || '', minWidth: image?.sizes?.thumbnail?.width },
				{ src: image?.sizes?.smallWebp?.url || '', minWidth: image?.sizes?.smallWebp?.width },
				{ src: image?.sizes?.small?.url || '', minWidth: image?.sizes?.small?.width },
				{ src: image?.sizes?.mediumWebp?.url || '', minWidth: image?.sizes?.mediumWebp?.width },
				{ src: image?.sizes?.medium?.url || '', minWidth: image?.sizes?.medium?.width }
			];

			return {
				id: product.id,
				title: product.title,
				image: {
					src,
					srcsets,
					alt,
					width: image?.sizes?.thumbnailWebp?.width,
					height: image?.sizes?.thumbnailWebp?.height
				},
				variationId: defaultVariation?.id,
				price: defaultVariation?.price
			};
		});
	});
</script>

<div
	class="products-grid"
	style={css({
		'--size': props.size || '200px'
	})}
>
	{#if products.length > 0}
		<div class="products-grid__content">
			<div class="products-grid__items">
				{#each products as product}
					<article class="products-grid__item">
						<a
							class="products-grid__image"
							href={`/products/${product.id}`}
							aria-label="Product image"
						>
							<div class="products-grid__image-content">
								{#if product.image.src}
									{#key product.image.src}
										<Image
											baseUrl={props.baseUrl}
											src={product.image.src}
											srcsets={product.image.srcsets}
											alt={product.image.alt}
											width={product.image.width}
											height={product.image.height}
											lazyload={true}
										/>
									{/key}
								{:else}
									<span>No image</span>
								{/if}
							</div>
						</a>
						<div class="products-grid__footer">
							<h3>{product.title}</h3>

							<div>
								{#if product.price}
									<p aria-label="Price">€ {product.price}</p>
								{/if}

								{#if typeof product.variationId === 'number'}
									<Button
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
									</Button>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	{/if}

	{#if props.onloadmore}
		<div class="products-grid__load-more">
			<Button
				onclick={props.onloadmore}
				onintersect={(intersecting) => {
					if (intersecting) {
						props.onloadmore?.();
					}
				}}
			>
				{props.isLoading ? 'Loading...' : 'Load More'}
			</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.products-grid {
		&__content {
			overflow: hidden;
			position: relative;
		}

		&__items {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(var(--size), 1fr));
			grid-gap: var(--main-padding);
		}

		&__item {
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

		&__item:hover {
			h3 {
				text-decoration: underline;
			}
		}

		&__footer {
			padding-top: 0.5rem;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			height: 100%;
			flex: 1 1 auto;
			justify-content: space-between;

			h3 {
				font-size: 1rem;
				margin: 0;
			}

			p {
				margin: 0;
				margin-bottom: 0.2rem;
			}
		}

		&__content + &__load-more {
			margin-top: var(--main-padding);
		}
	}
</style>
