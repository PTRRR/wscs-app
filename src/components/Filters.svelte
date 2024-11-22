<script lang="ts" module>
	// Defines a checkbox filter element with optional label and default state
	export type CheckboxElement = {
		type: 'checkbox';
		label?: string | null;
		value: string | number;
		default?: boolean;
	};

	// Defines a link filter element with optional label
	export type LinkElement = {
		type: 'link';
		label?: string | null;
		url: string;
	};

	// Union type for all possible filter elements
	export type FilterElement = CheckboxElement | LinkElement;
	type T = FilterElement;
</script>

<script lang="ts">
	// Component props including optional radio behavior and selection callback
	const props: {
		radio?: boolean; // If true, only one checkbox can be selected at a time
		title?: string; // Optional title for the filter group
		items: T[]; // Array of filter elements to display
		onSelected?: (items: T[]) => void; // Callback fired when selection changes
	} = $props();

	const { items, radio, onSelected } = props;

	// Tracks references to all checkbox input elements for state management
	const inputElements: HTMLInputElement[] = $state([]);

	// Unchecks all checkboxes - used for radio behavior
	const deselectAll = () => {
		inputElements.forEach((input) => {
			input.checked = false;
		});
	};

	// Handles checkbox clicks with special handling for radio behavior
	const handleElementClick = (index: number) => {
		// For radio mode: if checking a box, first uncheck all others
		if (radio && inputElements[index].checked) {
			deselectAll();
			inputElements[index].checked = !inputElements[index].checked;
		}
		let selectedItems = listSelectedItemsWithDefaults();
		onSelected?.(selectedItems);
	};

	// Returns array of currently selected filter elements
	const listSelectedItems = () => {
		const selectedInputElements = inputElements.filter((input) => input.checked);
		const elIndexes = selectedInputElements.map((input) => parseInt(input.dataset.elIndex || ''));
		const selectedItems = items.filter((item, index) => elIndexes.includes(index));
		return selectedItems;
	};

	// Returns selected items, falling back to default items if none selected
	const listSelectedItemsWithDefaults = () => {
		let selectedItems = listSelectedItems();

		// Find indexes of items marked as default
		const defaultItemIndexes = items.reduce<number[]>((acc, it, index) => {
			if (it.type === 'checkbox' && it.default) {
				acc.push(index);
			}
			return acc;
		}, []);

		// If no selection but defaults exist, select the defaults
		if (defaultItemIndexes.length > 0 && selectedItems.length === 0) {
			defaultItemIndexes.forEach((index) => {
				inputElements[index].checked = true;
			});
			selectedItems = listSelectedItems();
		}
		return selectedItems;
	};

	// Trigger onSelected callback whenever selection state changes
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
