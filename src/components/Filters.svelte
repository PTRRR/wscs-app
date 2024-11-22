<script lang="ts" module>
	export type CheckboxElement = {
		type: 'checkbox';
		label?: string | null;
		value: string | number;
		default?: boolean;
	};

	export type LinkElement = {
		type: 'link';
		label?: string | null;
		url: string;
	};

	export type FilterElement = CheckboxElement | LinkElement;

	type T = FilterElement;
</script>

<script lang="ts">
	const props: {
		radio?: boolean;
		title?: string;
		items: T[];
		onSelected?: (items: T[]) => void;
	} = $props();

	const { items, radio, onSelected } = props;

	const inputElements: HTMLInputElement[] = $state([]);

	const deselectAll = () => {
		inputElements.forEach((input) => {
			input.checked = false;
		});
	};

	const handleElementClick = (index: number) => {
		if (radio && inputElements[index].checked) {
			deselectAll();
			inputElements[index].checked = !inputElements[index].checked;
		}

		let selectedItems = listSelectedItemsWithDefaults();
		onSelected?.(selectedItems);
	};

	const listSelectedItems = () => {
		const selectedInputElements = inputElements.filter((input) => input.checked);
		const elIndexes = selectedInputElements.map((input) => parseInt(input.dataset.elIndex || ''));
		const selectedItems = items.filter((item, index) => elIndexes.includes(index));
		return selectedItems;
	};

	const listSelectedItemsWithDefaults = () => {
		let selectedItems = listSelectedItems();
		const defaultItemIndexes = items.reduce<number[]>((acc, it, index) => {
			if (it.type === 'checkbox' && it.default) {
				acc.push(index);
			}
			return acc;
		}, []);

		if (defaultItemIndexes.length > 0 && selectedItems.length === 0) {
			defaultItemIndexes.forEach((index) => {
				inputElements[index].checked = true;
			});

			selectedItems = listSelectedItems();
		}

		return selectedItems;
	};

	$effect(() => {
		const selectedItems = listSelectedItemsWithDefaults();
		onSelected?.(selectedItems);
	});
</script>

<div class="filters">
	{#each items as filter, index}
		{#if filter.type === 'checkbox'}
			<input
				type="checkbox"
				bind:this={inputElements[index]}
				data-el-index={index}
				onclick={() => handleElementClick(index)}
			/>
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
