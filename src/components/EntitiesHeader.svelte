<script lang="ts">
	import type { Entity } from '../utilities/api/types';

	const props: {
		baseUrl?: string;
		entities: Entity[];
	} = $props();
</script>

<section class="entities-header">
	{#each props.entities as entity}
		{#if typeof entity.logo !== 'number'}
			<a href={`/entities/${entity.slug}`}>
				<img
					src={`${props.baseUrl || 'http://localhost:3000'}${entity.logo.url}`}
					alt={entity.title}
					width={entity.logo.width}
					height={entity.logo.height}
				/>
			</a>
		{/if}
	{/each}
</section>

<style lang="scss">
	.entities-header {
		display: flex;
		justify-content: space-between;
		padding: var(--main-padding);

		a {
			height: 2rem;
			display: block;

			img {
				height: 100%;
				width: auto;
			}
		}
	}
</style>
