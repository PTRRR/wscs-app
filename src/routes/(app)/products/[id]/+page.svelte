<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { WSCS } from '../../../../utilities/api';
	import AddToCartButton from '../../../../components/AddToCartButton.svelte';
	import LexicalReader from '../../../../components/LexicalReader.svelte';

	const props: { data: PageData } = $props();
	const { data } = props;

	const api = new WSCS();

	onMount(() => {
		api.findProducts().then((res) => console.log(res));
	});
</script>

<svelte:head>
	<title>{data.product.title}</title>
</svelte:head>

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
