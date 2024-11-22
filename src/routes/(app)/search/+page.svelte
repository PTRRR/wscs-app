<script lang="ts">
	import type { PageData } from './$types';
	import { useSearchEngine } from '../../../store';
	import type { Product } from '../../../utilities/api/types';

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
		search(props.data.q).then((res) => {
			hits = res.hits.map(({ document }) => document);
		});
	});
</script>

<h1>{props.data.q}</h1>

<div class="hits">
	{#each hits as product}
		<a href={`/products/${product.id}`}>{product.title}</a>
	{/each}
</div>

<style lang="scss">
	.hits {
		display: flex;
		flex-direction: column;
	}
</style>
