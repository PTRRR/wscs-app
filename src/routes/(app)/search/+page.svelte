<script lang="ts">
	import type { PageData } from './$types';
	import { useSearchEngine } from '../../../store';
	import type { Product } from '../../../utilities/api/types';
	import ProductsGrid from '../../../components/ProductsGrid.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;

	const { search } = useSearchEngine(
		data.api.baseUrl,
		data.typesense.productsCollection,
		data.typesense.clientConfig
	);

	let isLoading = $state(Boolean(props.data.q));
	let canLoadMore = $state(true);
	let page = 1;
	let limit = 50;
	let hits: Product[] = $state([]);

	const handleSearch = async () => {
		if (typeof props.data.q !== 'string' || props.data.q.length === 0) return [];

		isLoading = true;
		const res = await search({ query: props.data.q, queryBy: 'title', page, limit });
		canLoadMore = res.length === limit;
		isLoading = false;
		return res;
	};

	const handleLoadMore = async () => {
		page++;
		const res = await handleSearch();
		hits = [...hits, ...res];
	};

	$effect(() => {
		hits = [];
		page = 1;
		canLoadMore = true;
		handleSearch().then((res) => (hits = res));
	});
</script>

<div class="search">
	{#if isLoading && hits.length === 0}
		<h4>Searching...</h4>
	{:else if hits.length === 0}
		<h4>No results found for: {props.data.q}</h4>
	{:else if hits.length > 0}
		<h4>Search results for: {props.data.q}</h4>
	{/if}

	<ProductsGrid
		products={hits}
		{isLoading}
		baseUrl={data.api.baseUrl}
		onloadmore={canLoadMore && hits.length > 0 ? handleLoadMore : undefined}
	/>
</div>

<style lang="scss">
	.search {
		padding: var(--main-padding);

		h4 {
			font-size: 2rem;
			margin: 0;
			margin-bottom: 1rem;
		}
	}
</style>
