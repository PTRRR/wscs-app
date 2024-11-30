<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<h1>Error: {data.message}</h1>

<style lang="scss">
	h1 {
		text-align: center;
	}
</style>
