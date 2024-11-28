<script lang="ts">
	import LexicalReader from '../../../../components/LexicalReader.svelte';
	import ProductsGrid from '../../../../components/ProductsGrid.svelte';
	import Slideshow from '../../../../components/Slideshow.svelte';
	import { WSCS } from '../../../../utilities/api';
	import type { ArticleProductsBlock, Variation } from '../../../../utilities/api/types';
	import { getApiObject } from '../../../../utilities/api/utils';
	import { filterDuplicate, filterNullish } from '../../../../utilities/iterables';
	import type { PageData } from './$types';

	const props: { data: PageData } = $props();
	const {
		article,
		api: { baseUrl }
	} = props.data;

	let variations = $state<Variation[]>([]);

	const api = new WSCS(baseUrl);
	const slides = (article.slideshow?.map((slide) => getApiObject(slide)) || []).filter(
		filterNullish
	);

	const products = $derived(
		article.content
			?.filter((it) => it.blockType === 'Products')
			.map((it) => it.products?.map(getApiObject).filter(filterNullish))
			.filter(filterNullish)
			.flat() || []
	);

	const getProductVariations = (productId: number) =>
		variations.filter((it) =>
			typeof it.product === 'number' ? it.product === productId : it.product?.id === productId
		);

	const formatProductsBlock = (block: ArticleProductsBlock) => {
		return (
			block.products
				?.map(getApiObject)
				.filter(filterNullish)
				.map((it) => ({
					...it,
					variations: { docs: getProductVariations(it.id) }
				})) || []
		);
	};

	const formattedBlocks = $derived.by(() => {
		return (
			article.content
				?.map((it) =>
					it.blockType === 'Text'
						? it
						: it.blockType === 'Products'
							? { ...it, products: formatProductsBlock(it) }
							: undefined
				)
				.filter(filterNullish) || []
		);
	});

	$effect(() => {
		const variationIds = products
			.map((it) => (it.variations?.docs || []).map((it) => (typeof it === 'number' ? it : it.id)))
			.filter(filterDuplicate)
			.flat();

		api
			.findVariations({
				limit: variationIds.length,
				query: {
					id: {
						in: variationIds
					}
				}
			})
			.then((res) => (variations = res.docs));
	});
</script>

<svelte:head>
	<title>{article.title}</title>
</svelte:head>

<div class="article">
	<Slideshow {baseUrl} {slides} height="60vh" />

	<article>
		<h1>{article.title}</h1>
		<div class="article__content">
			{#each formattedBlocks as block}
				{#if block.blockType === 'Text'}
					<div class="article__block article__text-block">
						<LexicalReader content={block.content} />
					</div>
				{:else if block.blockType === 'Products'}
					<div class="article__block">
						<ProductsGrid products={block.products} size="30%" />
					</div>
				{/if}
			{/each}
		</div>
	</article>
</div>

<style lang="scss">
	.article {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 4rem;

		article {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		h1 {
			text-align: center;
			font-family: Lescargot, 'Courier New', Courier, monospace;
		}

		&__content {
			max-width: 70rem;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 4rem;
		}

		&__block {
			width: 100%;
		}

		&__text-block {
			max-width: 40rem;
		}
	}
</style>
