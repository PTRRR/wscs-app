<script lang="ts">
	import type { Entity } from '../utilities/api/types';

	const props: {
		entities: Entity[];
	} = $props();
</script>

<section class="entities-header">
	{#each props.entities as entity}
		<a href={`/entities/${entity.id}`}>{entity.title}</a>
	{/each}
</section>

<style lang="scss">
	.entities-header {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}
</style>
