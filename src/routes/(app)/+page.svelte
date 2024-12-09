<script lang="ts">
	import type { Product } from '../../utilities/api/types';
	import type { PageData } from './$types';
	import HomeArticles from '../../components/HomeArticles.svelte';
	import EntitiesHeader from '../../components/EntitiesHeader.svelte';
	import HomeFilters from '../../components/HomeFilters.svelte';
	import { useSearchEngine } from '../../store';
	import ProductsGrid from '../../components/ProductsGrid.svelte';
	import Range from '../../components/Range.svelte';
	import { filterNullish } from '../../utilities/iterables';
	import { Client } from 'typesense';
	import { onMount } from 'svelte';
	import { searchProductToProduct, type Hit, type SearchProduct } from '../../utilities/typesense';

	const props: { data: PageData } = $props();
	const { data } = props;
	const client = new Client(data.typesense.clientConfig);

	const { search } = useSearchEngine(
		data.api.baseUrl,
		data.typesense.productsCollection,
		data.typesense.clientConfig
	);

	let offset = data.products.length;
	const limit = 50;

	let products = $state(data.products);
	let isLoading = $state(false);
	let canLoadMore = $state(true);
	let filterBy = $state<string | undefined>(undefined);
	let searchResults: Product[] = $state([]);

	const handleSearch = async () => {
		isLoading = true;

		const res = await search({
			query: '*',
			filterBy,
			limit,
			offset
		});

		canLoadMore = res.length === limit;
		isLoading = false;

		offset += res.length;

		return res;
	};

	let debounceLoadMoreTimeout: NodeJS.Timeout | undefined = undefined;

	const handleLoadMore = async () => {
		if (debounceLoadMoreTimeout) clearTimeout(debounceLoadMoreTimeout);

		debounceLoadMoreTimeout = setTimeout(async () => {
			const res = await handleSearch();

			searchResults = [...searchResults, ...res];
			products =
				typeof filterBy === 'undefined' ? [...data.products, ...searchResults] : searchResults;
		}, 200);
	};

	let rangeValue = $state(1);
	const productsSize = $derived(`${150 + rangeValue * 50}px`);

	onMount(async () => {
		// We refetch products in order to get the freshest data as cache might deliver
		// old data such as for product inventary
		const { hits } = (await client
			.collections(data.typesense.productsCollection)
			.documents()
			.search({
				q: '*',
				limit: 20
			})) as { hits: Hit<SearchProduct>[] };

		products = hits.map((it) => searchProductToProduct(it.document));
	});
</script>

<svelte:head>
	<title>Words, Sounds, Colors & Shapes</title>
</svelte:head>

<div class="home__entities">
	<EntitiesHeader baseUrl={data.api.baseUrl} entities={data.entities} />
</div>

{#if data.featuredArticles.length > 0}
	<HomeArticles baseUrl={data.api.baseUrl} articles={data.featuredArticles} />
{/if}

<div class="home">
	<section class="home__products" aria-label="Product listings">
		<h2>Products</h2>
		<aside class="home__filters">
			<HomeFilters
				filters={data.filters}
				additionalFilters={data.additionalFilters}
				entities={data.entities}
				brands={data.brands}
				onSelected={async (selection) => {
					const { tags, productTypes, entities, brands } = selection;

					filterBy =
						[
							productTypes.length > 0 ? `type:[${productTypes.join(',')}]` : undefined,
							tags.length > 0 ? `tags:=[${tags.join(',')}]` : undefined,
							entities.length > 0 ? `entities:=[${entities.join(',')}]` : undefined,
							brands.length > 0 ? `brand:[${brands.join(',')}]` : undefined
						]
							.filter(filterNullish)
							.join(' && ') || undefined;

					offset = typeof filterBy === 'undefined' ? data.products.length : 0;
					canLoadMore = true;

					if (filterBy) {
						searchResults = await handleSearch();
					} else {
						searchResults = [];
					}

					products =
						typeof filterBy === 'undefined' ? [...data.products, ...searchResults] : searchResults;
				}}
			/>

			<div class="home__range">
				<Range bind:value={rangeValue} pips={true} title="Image Size" />
			</div>
		</aside>

		<ProductsGrid
			{products}
			{isLoading}
			size={productsSize}
			baseUrl={data.api.baseUrl}
			onloadmore={canLoadMore ? handleLoadMore : undefined}
		/>

		{#if products.length === 0}
			<p>No products found.</p>
		{/if}
	</section>
</div>

<style lang="scss">
	.home {
		padding: var(--main-padding);

		h2 {
			font-family: Lescargot, 'Courier New', Courier, monospace;
		}

		&__range {
			width: 30%;
		}

		@media screen and (max-width: 1000px) {
			&__entities,
			&__range {
				display: none;
			}
		}
	}
</style>
