<script lang="ts">
	import type { Product } from '../../utilities/api/types';
	import type { PageData } from './$types';
	import HomeArticles from '../../components/HomeArticles.svelte';
	import EntitiesHeader from '../../components/EntitiesHeader.svelte';
	import HomeFilters from '../../components/HomeFilters.svelte';
	import { useSearchEngine } from '../../store';
	import ProductsGrid from '../../components/ProductsGrid.svelte';
	import { filterNullish } from '../../utilities/iterables';

	const props: { data: PageData } = $props();
	const { data } = props;

	const { search } = useSearchEngine(
		data.api.baseUrl,
		data.typesense.productsCollection,
		data.typesense.clientConfig
	);

	let searchResults: Product[] = $state([]);
	const products = $derived(searchResults.length > 0 ? searchResults : data.products);
</script>

<svelte:head>
	<title>Words, Sounds, Colors & Shapes</title>
</svelte:head>

<div class="home">
	<EntitiesHeader entities={data.entities} />

	{#if data.article}
		<HomeArticles article={data.article} />
	{/if}

	<section class="home__filters">
		<h3>Filters:</h3>
		<HomeFilters
			filters={data.filters}
			entities={data.entities}
			brands={data.brands}
			onSelected={(selection) => {
				const { tags, productTypes, entities } = selection;

				const filterBy = [
					productTypes.length > 0 ? `type:[${productTypes.join(',')}]` : undefined,
					tags.length > 0 ? `tags:=[${tags.join(',')}]` : undefined,
					entities.length > 0 ? `entities:=[${entities.join(',')}]` : undefined
				]
					.filter(filterNullish)
					.join(' && ');

				if (filterBy) {
					search({
						query: '*',
						filterBy
					}).then((res) => (searchResults = res));
				} else {
					searchResults = [];
				}
			}}
		/>
	</section>

	<ProductsGrid {products} baseUrl={data.api.baseUrl} />
</div>

<style lang="scss">
	.home {
		&__filters {
			padding: 0 2rem;
		}
	}
</style>
