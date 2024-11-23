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

	let hits: Product[] = $state([]);

	$effect(() => {
		if (typeof props.data.q !== 'string' || props.data.q.length === 0) return;
		search({ query: props.data.q, queryBy: 'title' }).then((res) => {
			hits = res.hits.map(({ document }) => document);
		});
	});
</script>

<ProductsGrid products={hits} />
