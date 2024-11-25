<script lang="ts">
	import type { PageData } from './$types';
	import AddToCartButton from '../../../../components/AddToCartButton.svelte';
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import Image from '../../../../components/Image.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;
</script>

<svelte:head>
	<title>{data.product.title}</title>
</svelte:head>

<div class="product">
	<div class="product__columns">
		<div class="product__column">
			{#each data.product.variations?.docs || [] as variation}
				{#if typeof variation !== 'number' && typeof variation.image === 'object'}
					<Image
						baseUrl={data.api.baseUrl}
						src={variation.image?.sizes?.largeWebp?.url || variation.image?.url || ''}
					/>
				{/if}
			{/each}
		</div>

		<div class="product__column">
			<h1>{data.product.title}</h1>

			{#each data.product.variations?.docs || [] as variation}
				{#if typeof variation !== 'number'}
					<p>{variation.name}</p>
					<p>{variation.price}</p>

					{#if typeof variation.price === 'number' && variation.price > 0}
						<AddToCartButton product={data.product.id} variation={variation.id} quantity={1} />
					{/if}
				{/if}
			{/each}

			<LexicalReader content={data.product.description} />

			<a href="/checkout">Checkout</a>
		</div>
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
		}

		&__column {
			width: 50%;

			:global(picture) {
				width: 100%;
			}
		}

		&__column:nth-child(2) {
			position: sticky;
			top: 36.7px;
		}
	}
</style>
