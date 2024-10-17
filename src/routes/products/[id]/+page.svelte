<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { WSCS } from '../../../utilities/api';
	import AddToCartButton from '../../../components/AddToCartButton.svelte';

	export let data: PageData;

	const api = new WSCS();

	onMount(() => {
		api.findProducts().then((res) => console.log(res));
	});
</script>

<svelte:head>
	<title>{data.product.title}</title>
</svelte:head>

<h1>{data.product.title}</h1>

{#each data.product.variations || [] as variation}
	{#if typeof variation !== 'number'}
		<p>{variation.name}</p>
		<p>{variation.price}</p>

		{#if typeof variation.price === 'number' && variation.price > 0}
			<AddToCartButton
				productId={data.product.id}
				variationId={variation.id}
				price={variation.price}
				quantity={1}
			/>
		{/if}
	{/if}
{/each}

<p>{data.product.description}</p>

<a href="/checkout">Checkout</a>
