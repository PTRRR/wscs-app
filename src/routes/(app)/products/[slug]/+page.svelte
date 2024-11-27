<script lang="ts">
	import type { PageData } from './$types';
	import AddToCartButton from '../../../../components/AddToCartButton.svelte';
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import Image from '../../../../components/Image.svelte';
	import { WSCS } from '../../../../utilities/api';
	import type { Variation } from '../../../../utilities/api/types';
	import ProductAttributes from '../../../../components/ProductAttributes.svelte';
	import Button from '../../../../components/Button.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;
	const api = new WSCS(data.api.baseUrl);
	let variations = $state<Variation[]>([]);
	let readMore = $state(false);

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
		<div class="product__column">
			{#each data.product.images || [] as image}
				{#if typeof image !== 'number'}
					<Image
						baseUrl={data.api.baseUrl}
						src={image?.sizes?.largeWebp?.url || image?.url || ''}
					/>
				{/if}
			{/each}
		</div>

		<section class="product__column">
			{#if typeof data.product.brand === 'object'}
				<span class="product__brand">{data.product.brand?.title}</span>
			{/if}

			<h1 class="product__title">{data.product.title}</h1>

			<!-- {#each variations as variation}
				<p class="product__price">€ {variation.price?.toFixed(2)}</p>
				<span>Tax included.</span>

				{#if typeof variation.price === 'number' && variation.price > 0}
					<AddToCartButton product={data.product.id} variation={variation.id} quantity={1} />
				{/if}
			{/each} -->

			{#if variations.length > 0}
				<ProductAttributes {variations} />
			{:else}
				<p>Loading...</p>
			{/if}

			<LexicalReader content={data.product.description} maxLines={readMore ? undefined : 4} />

			{#if !readMore}
				<Button onclick={() => (readMore = true)}>Read more</Button>
			{/if}

			<a href="/checkout">Checkout</a>
		</section>
	</div>
</div>

<style lang="scss">
	.product {
		h1 {
			font-family: Lescargot, 'Courier New', Courier, monospace;
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
			gap: 1rem;
			padding: 1rem 0;
			align-items: flex-start;

			:global(picture) {
				width: 100%;
			}
		}

		&__column:nth-child(2) {
			position: sticky;
			top: 36.7px;
		}

		&__brand {
			text-transform: uppercase;
		}

		&__title {
			margin: 0;
		}
	}
</style>
