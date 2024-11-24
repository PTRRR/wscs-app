<script lang="ts">
	import type { Product, Variation } from '../utilities/api/types';
	import { getApiObject, getApiObjectId } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';

	const props: {
		products: Product[];
	} = $props();

	let products = $state<{ id: number; imageUrl?: string; title: string }[]>(
		props.products.map((it) => ({
			id: it.id,
			title: it.title
		}))
	);

	$effect(() => {
		const defaultVariations: Variation[] = [];

		for (const product of props.products) {
			const productVariations = product.variations?.docs || [];
			const defaultVariation =
				productVariations
					.map(getApiObject)
					.filter(filterNullish)
					.find((it) => it.isDefault) || getApiObject(productVariations[0]);

			if (defaultVariation) {
				defaultVariations.push(defaultVariation);
			}
		}

		products = props.products.map((product) => {
			const variation = defaultVariations.find(
				(variation) => getApiObjectId(variation.product) === product.id
			);
			return { id: product.id, title: product.title, imageUrl: getVariationImageUrl(variation) };
		});
	});

	const getVariationImageUrl = (variation?: Variation) => {
		const image = getApiObject(variation?.image);
		const smallImage = image?.sizes?.smallWebp || image?.sizes?.small;
		return smallImage
			? smallImage?.url
				? `http://localhost:3000${smallImage.url}`
				: undefined
			: image?.url
				? `http://localhost:3000${image.url}`
				: undefined;
	};
</script>

<div class="products-grid">
	{#each products as product}
		<div class="products-grid__item">
			<a class="products-grid__image" href={`/products/${product.id}`} aria-label="Product image">
				<div class="products-grid__image-content">
					{#if product.imageUrl}
						{#key product.imageUrl}
							<img src={product.imageUrl} alt="" />
						{/key}
					{:else}
						<span>No image</span>
					{/if}
				</div>
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
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				width: 100%;
				height: 100%;
				border: none;
			}
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
