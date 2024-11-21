<script lang="ts">
	import type { Entity } from '../utilities/api/types';

	const props: {
		entities: Entity[];
	} = $props();
</script>

<div class="entities-header">
	{#each props.entities as entity}
		<span>{entity.title}</span>
	{/each}
</div>

<style lang="scss">
	.entities-header {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}
</style>
