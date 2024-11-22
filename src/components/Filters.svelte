<script lang="ts">
	type CheckboxElement = {
		type: 'checkbox';
		label?: string;
		value: string | number;
	};

	type LinkElement = {
		type: 'link';
		label?: string;
		url: string;
	};

	const props: {
		title?: string;
		filters: (CheckboxElement | LinkElement)[];
	} = $props();

	const { filters } = props;
</script>

<div class="filters">
	{#each filters as filter}
		{#if filter.type === 'checkbox'}
			<input type="checkbox" />
			<span>{filter.label || filter.value}</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	.filters {
		display: flex;
		padding: 1rem;
		border: solid 1px black;
		border-radius: 5px;
	}
</style>
