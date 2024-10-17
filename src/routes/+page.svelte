<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

<h1>sdflkjh</h1>

{#each data.products as product}
	<div class="product">
		<a href={`/products/${product.id}`}>
			<h2>{product.title}</h2>
		</a>
	</div>
{/each}
