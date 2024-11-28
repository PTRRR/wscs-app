<script lang="ts">
	import type { PageData } from './$types';
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import Image from '../../../../components/Image.svelte';
	import { WSCS } from '../../../../utilities/api';
	import type { Variation } from '../../../../utilities/api/types';
	import ProductAttributes from '../../../../components/ProductAttributes.svelte';
	import Button from '../../../../components/Button.svelte';
	import Quantity from '../../../../components/Quantity.svelte';
	import { useLocalCart } from '../../../../store';
	import ReadMoreButton from '../../../../components/ReadMoreButton.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;
	const api = new WSCS(data.api.baseUrl);
	let variations = $state<Variation[]>([]);
	let selectedVariation = $state<Variation | undefined>(undefined);
	let readMore = $state(false);
	let quantity = $state(1);
	let added = $state(false);
	const outOfStock = $derived(selectedVariation && (selectedVariation?.inventory || 0) === 0);

	const { addToCart } = useLocalCart();

	$effect(() => {
		api
			.findVariations({
				query: {
					product: {
						equals: data.product.id
					}
				}
			})
			.then(({ docs }) => {
				variations = docs;
			});
	});
</script>

<svelte:head>
	<title>{data.product.title}</title>
</svelte:head>

<div class="product">
	<div class="product__columns">
		<div class="product__column product__images">
			{#each data.product.images || [] as image}
				{#if typeof image !== 'number'}
					<Image
						baseUrl={data.api.baseUrl}
						src={image?.sizes?.largeWebp?.url || image?.url || ''}
					/>
				{/if}
			{/each}
		</div>

		<section class="product__column product__information">
			<div class="product__information-header">
				{#if typeof data.product.brand === 'object'}
					<span class="product__brand">{data.product.brand?.title}</span>
				{/if}

				<h1 class="product__title">{data.product.title}</h1>
			</div>

			{#if selectedVariation}
				<div class="product__price-info">
					<p class="product__price">€ {selectedVariation.price?.toFixed(2)}</p>
					<span>Tax included.</span>
				</div>
			{/if}

			{#if variations.length > 0}
				<ProductAttributes
					{variations}
					onselection={(selection) => {
						selectedVariation = variations.find((it) => {
							const selectionEntries = Object.entries(selection);
							const attributeValues = it.attributeValues as Record<string, string>;
							return selectionEntries.every(
								([attributeName, value]) => attributeValues[attributeName] === value?.id
							);
						});
					}}
				/>
				<Quantity bind:value={quantity} min={1} />
			{:else}
				<p>Loading...</p>
			{/if}

			<LexicalReader content={data.product.description} maxLines={readMore ? undefined : 4} />

			{#if !readMore}
				<ReadMoreButton onclick={() => (readMore = true)} />
			{/if}

			<Button
				class="product__add-to-cart"
				disabled={!selectedVariation || added || outOfStock}
				onclick={() => {
					if (!selectedVariation) return;
					addToCart({
						product: data.product.id,
						variation: selectedVariation.id,
						quantity
					});

					added = true;
				}}>{added ? 'Item added' : outOfStock ? 'Out of stock' : 'Add to cart'}</Button
			>
		</section>
	</div>
</div>

<style lang="scss">
	.product {
		h1 {
			font-family: Lescargot, 'Courier New', Courier, monospace;
			font-size: 2rem;
		}

		&__columns {
			display: flex;
			align-items: flex-start;
			gap: 1rem;
		}

		&__column {
			width: 50%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;

			:global(picture) {
				width: 100%;
			}
		}

		&__information {
			gap: 1rem;
			padding: 1rem;
			position: sticky;
			top: 36.7px;
		}

		&__brand {
			text-transform: uppercase;
		}

		&__title {
			margin: 0;
		}

		&__price {
			margin: 0;
			font-size: 1.5rem;
		}

		@media screen and (max-width: 800px) {
			&__columns {
				flex-direction: column;
			}

			&__images {
				flex-direction: row;
				height: 40vh;
				width: 100%;
				overflow: auto;

				:global(picture) {
					width: initial;
					height: 100%;
				}
			}

			&__information {
				width: 100%;
				position: initial;
				padding-bottom: 4rem;
			}
		}
	}

	:global(.product__add-to-cart) {
		width: 100%;
	}
</style>
