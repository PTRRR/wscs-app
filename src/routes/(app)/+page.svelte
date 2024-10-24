<script lang="ts">
	import { Client } from 'typesense';
	import AddToCartButton from '../../components/AddToCartButton.svelte';
	import type { Product, Variation } from '../../utilities/api/types';
	import type { PageData } from './$types';

	type Hit<T> = {
		document: T;
	};

	export let data: PageData;

	let searchSesult: Product[] = [];
	$: products = searchSesult.length > 0 ? searchSesult : data.products;

	const client = new Client({
		apiKey: data.typesense.key.value as string,
		nodes: [
			{
				host: data.typesense.host,
				port: data.typesense.port,
				protocol: data.typesense.protocol
			}
		]
	});

	const search = async (query: string): Promise<{ hits: Hit<Product>[] }> => {
		return client.collections(data.typesense.productsCollection).documents().search({
			q: query,
			limit: 60,
			query_by: 'title'
		}) as Promise<{ hits: Hit<Product>[] }>;
	};

	const getFirstProductVariation = (product: Product): Variation[] => {
		if (product.variations && product.variations?.length > 0) {
			const variation = product.variations[0];
			if (typeof variation !== 'number') {
				return [variation];
			}
		}
		return [];
	};
</script>

<svelte:head>
	<title>Words, Sounds, Colors & Shapes</title>
</svelte:head>

<h1>Words, Sounds, Colors & Shapes</h1>

<input
	type="text"
	placeholder="Search"
	on:input={async (event) => {
		const value = event.currentTarget.value;

		if (value) {
			const result = await search(value);
			searchSesult = result.hits.map((it) => it.document);
		} else {
			searchSesult = [];
		}
	}}
/>

<div class="products">
	{#each products as product}
		<div class="product">
			<a href={`/products/${product.id}`}>
				{#each getFirstProductVariation(product) as variation}
					{#if variation.image && typeof variation.image !== 'number'}
						<img
							src={variation.image.sizes?.smallWebp?.url ||
								variation.image.sizes?.small?.url ||
								variation.image.url}
							alt={variation.image.filename}
						/>
					{/if}
				{/each}
				<h2>{product.title}</h2>
			</a>

			{#each getFirstProductVariation(product) as variation}
				<AddToCartButton product={product.id} variation={variation.id} />
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.products {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.product {
		width: 300px;
		margin-bottom: 20px;
		text-align: center;
		border: 1px solid #ccc;
		padding: 10px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		transition: 0.3s;
		border-radius: 5px;
		background-color: #f9f9f9;
		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 400px;

		& a {
			display: flex;
			flex-direction: column;
			height: 10%;
			flex: 1 1 auto;
		}
	}

	img {
		flex: 1 1 auto;
		object-fit: contain;
		width: 100%;
		height: 10%;
	}
</style>
