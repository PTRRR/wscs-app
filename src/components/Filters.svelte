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
	export type Section = {
		title?: string | null;
		elements: T[];
	};
</script>

<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	// Component props including optional radio behavior and selection callback
	const props: {
		radio?: boolean; // If true, only one checkbox can be selected at a time
		sections: Section[]; // Array of filter elements to display
		onSelected?: (elements: T[]) => void; // Callback fired when selection changes
	} = $props();

	const { sections: sections, radio, onSelected } = props;

	// Tracks references to all checkboxs for state management
	const checkboxes: Record<string, Checkbox> = $state({});

	// Handles checkbox clicks with special handling for radio behavior
	const handleElementClick = (value: string, checked: boolean) => {
		const currentCheckbox = checkboxes[value];
		if (!currentCheckbox) return;
		currentCheckbox.setChecked(checked);

		// For radio mode: if checking a box, first uncheck all others
		if (radio && checked) {
			Object.entries(checkboxes).forEach(([currentValue, checkbox]) => {
				if (currentValue !== value) {
					checkbox.setChecked(false);
				}
			});
		}

		let selectedItems = listSelectedElementsWithDefaults();
		onSelected?.(selectedItems);
	};

	// Returns array of currently selected filter elements
	const listSelectedElements = () => {
		const selectedCheckboxes = Object.values(checkboxes).filter((checkbox) => checkbox.isChecked());
		const elValues = selectedCheckboxes.map((checkbox) => checkbox.getValue()?.toString());
		const elements = sections.map((it) => it.elements).flat();
		const selectedElements = elements.filter(
			(element) => element.type === 'checkbox' && elValues.includes(element.value.toString())
		);
		return selectedElements;
	};

	// Returns selected items, falling back to default items if none selected
	const listSelectedElementsWithDefaults = () => {
		let selectedElements = listSelectedElements();
		const elements = sections.map((it) => it.elements).flat();

		// Find indexes of items marked as default
		const defaultElementValues = elements.flat().reduce<string[]>((acc, it) => {
			if (it.type === 'checkbox' && it.default) {
				acc.push(it.value.toString());
			}
			return acc;
		}, []);

		// If no selection but defaults exist, select the defaults
		if (defaultElementValues.length > 0 && selectedElements.length === 0) {
			defaultElementValues.forEach((value) => {
				checkboxes[value].setChecked(true);
			});
			selectedElements = listSelectedElements();
		}
		return selectedElements;
	};

	// Trigger onSelected callback whenever selection state changes
	$effect(() => {
		const selectedItems = listSelectedElementsWithDefaults();
		onSelected?.(selectedItems);
	});
</script>

{#each props.sections as section}
	<fieldset class="filters">
		{#if section.title}
			<legend>{section.title}</legend>
		{/if}

		<div class="filters__checkboxes">
			{#each section.elements as filter}
				{#if filter.type === 'checkbox'}
					<Checkbox
						bind:this={checkboxes[filter.value.toString()]}
						value={filter.value}
						label={filter.label || filter.value}
						onchange={({ checked }) => handleElementClick(filter.value.toString(), checked)}
					/>
				{/if}
			{/each}
		</div>
	</fieldset>
{/each}

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
		border: solid 1px var(--light-gray);
		border-radius: 5px;
		margin: 0;
		position: relative;

		legend {
			margin: 0;
			font-size: 1rem;
			line-height: 1;
			position: absolute;
			background-color: white;
			z-index: 10;
			top: 0;
			transform: translate(0, -50%);
		}

		&__checkboxes {
			display: flex;
			gap: 1rem;
		}
	}
</style>
