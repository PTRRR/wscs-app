<script lang="ts">
	const props: {
		title?: string;
		filters: {
			label?: string;
			value: string | number;
		}[];
	} = $props();

	const { filters } = props;
</script>

<div class="filters">
	{#each filters as filter}
		<input type="checkbox" />
		<span>{filter.label || filter.value}</span>
	{/each}
</div>
