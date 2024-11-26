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
	import Checkbox from './Checkbox.svelte';

	// Component props including optional radio behavior and selection callback
	const props: {
		radio?: boolean; // If true, only one checkbox can be selected at a time
		title?: string; // Optional title for the filter group
		items: T[]; // Array of filter elements to display
		onSelected?: (items: T[]) => void; // Callback fired when selection changes
	} = $props();

	const { items, radio, onSelected, title } = props;

	// Tracks references to all checkboxs for state management
	const checkboxes: Checkbox[] = $state([]);

	// Handles checkbox clicks with special handling for radio behavior
	const handleElementClick = (index: number, checked: boolean) => {
		// For radio mode: if checking a box, first uncheck all others
		if (radio && checked) {
			checkboxes[index].setChecked(checked);
			checkboxes.forEach((checkbox, currentIndex) => {
				if (currentIndex !== index) {
					checkbox.setChecked(false);
				}
			});
		}

		let selectedItems = listSelectedItemsWithDefaults();
		onSelected?.(selectedItems);
	};

	// Returns array of currently selected filter elements
	const listSelectedItems = () => {
		const selectedCheckboxes = checkboxes.filter((checkbox) => checkbox.isChecked());
		const elIndexes = selectedCheckboxes.map((checkbox) => checkbox.getValue() as number);
		const selectedItems = items.filter((_, index) => elIndexes.includes(index));
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
				checkboxes[index].setChecked(true);
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

<fieldset class="filters" class:filters--title={title}>
	{#if title}
		<legend>{title}</legend>
	{/if}

	<div class="filters__checkboxes">
		{#each items as filter, index}
			{#if filter.type === 'checkbox'}
				<Checkbox
					bind:this={checkboxes[index]}
					value={index}
					label={filter.label || filter.value}
					onchange={({ checked }) => handleElementClick(index, checked)}
				/>
			{/if}
		{/each}
	</div>
</fieldset>

<style lang="scss">
	:root {
		--filters-padding: 0.7rem;
		--filters-padding-small: calc(var(--filters-padding) * 0.5);
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: var(--filters-padding);
		border: solid 1px black;
		border-radius: 5px;
		margin: 0;

		&--title {
			padding: var(--filters-padding-small) var(--filters-padding) var(--filters-padding)
				var(--filters-padding);
			margin-top: -0.5rem;
		}

		legend {
			margin: 0;
			font-size: 1rem;
			line-height: 1;
		}

		&__checkboxes {
			display: flex;
			gap: 1rem;
		}
	}
</style>
