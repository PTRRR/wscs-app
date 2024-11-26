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

	let page = 1;
	const limit = 50;

	let isLoading = $state(false);
	let canLoadMore = $state(true);
	let filterBy = $state<string | undefined>(undefined);
	let searchResults: Product[] = $state([]);
	const products = $derived(
		typeof filterBy === 'undefined' ? [...data.products, ...searchResults] : searchResults
	);

	const handleSearch = async () => {
		isLoading = true;

		const res = await search({
			query: '*',
			filterBy,
			limit,
			page
		});

		canLoadMore = res.length === limit;
		isLoading = false;

		return res;
	};

	const handleLoadMore = async () => {
		page++;
		const res = await handleSearch();
		searchResults = [...searchResults, ...res];
	};
</script>

<svelte:head>
	<title>Words, Sounds, Colors & Shapes</title>
</svelte:head>

<div class="home__entities">
	<EntitiesHeader baseUrl={data.api.baseUrl} entities={data.entities} />
</div>

{#if data.article}
	<HomeArticles baseUrl={data.api.baseUrl} article={data.article} />
{/if}

<div class="home">
	<section class="home__products" aria-label="Product listings">
		<h2>Products</h2>
		<aside class="home__filters">
			<HomeFilters
				filters={data.filters}
				entities={data.entities}
				brands={data.brands}
				onSelected={(selection) => {
					const { tags, productTypes, entities } = selection;
					page = 1;
					canLoadMore = true;

					filterBy =
						[
							productTypes.length > 0 ? `type:[${productTypes.join(',')}]` : undefined,
							tags.length > 0 ? `tags:=[${tags.join(',')}]` : undefined,
							entities.length > 0 ? `entities:=[${entities.join(',')}]` : undefined
						]
							.filter(filterNullish)
							.join(' && ') || undefined;

					if (filterBy) {
						handleSearch().then((res) => (searchResults = res));
					} else {
						searchResults = [];
					}
				}}
			/>
		</aside>

		<ProductsGrid
			{products}
			{isLoading}
			baseUrl={data.api.baseUrl}
			onloadmore={canLoadMore ? handleLoadMore : undefined}
		/>
	</section>
</div>

<style lang="scss">
	.home {
		padding: var(--main-padding);

		h2 {
			font-family: Lescargot, 'Courier New', Courier, monospace;
		}

		@media screen and (max-width: 1000px) {
			&__entities,
			&__filters {
				display: none;
			}
		}
	}
</style>
