<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { findProducts } from '../../../utilities/api';
	import { joinPaths } from '../../../utilities/urls';

	export let data: PageData;

	// console.log(data.product.description);

	onMount(() => {
		findProducts().then((res) => console.log(res));
		console.log(joinPaths('http://localhost:3000', '/test'));
	});
</script>

<h1>{data.product.title}</h1>

{#each data.product.variations || [] as variation}
	{#if typeof variation !== 'number'}
		<p>{variation.name}</p>
		<p>{variation.price}</p>
	{/if}
{/each}

<p>{data.product.description}</p>
