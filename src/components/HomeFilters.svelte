<script lang="ts">
	import type { Brand, Entity, ProductType, Tag } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import Filters, { type FilterElement, type Section } from './Filters.svelte';
	import Select from './Select.svelte';

	// Used when tag ID is undefined but needs to be tracked in the UI
	const CUSTOM_UNDEFINED_TAG_ID = -1;

	// Describes a filter configuration with optional tag and product type constraints
	type Filter = {
		label?: string | null;
		tag?: (number | null) | Tag;
		productTypes?: (ProductType | number)[] | null;
		id?: string | null;
	};

	type AdditionalFilter = {
		label?: string | null;
		tag?: (number | null) | Tag;
		id?: string | null;
	};

	// Component props defining available entities, brands, filters and selection callback
	const props: {
		entities: Entity[];
		brands: Brand[];
		filters: Filter[];
		additionalFilters: AdditionalFilter[];
		onSelected?: (selection: {
			entities: number[];
			tags: number[];
			productTypes: number[];
			brands: number[];
		}) => void;
	} = $props();

	const additionalFilters = $derived(
		props.additionalFilters
			.map((it) => ({ ...it, tag: getApiObject(it.tag) }))
			.filter((it) => typeof it.tag !== 'undefined' && typeof it.label === 'string') as {
			label?: string | null;
			tag?: Tag;
		}[]
	);

	// Track selected IDs for each filter category
	let selectedEntities = $state<number[]>([]);
	let selectedTags = $state<number[]>([]);
	let selectedProductTypes = $state<number[]>([]);
	let selectedBrands = $state<number[]>([]);
	let showBrands = $state<boolean>(false);

	// Type mapping for handling different value types in filters
	type ValueTypeMap = {
		number: number;
		string: string;
	};

	// Extracts values of specified type from selected filter items
	const getSelectedValues = <T extends keyof ValueTypeMap = 'number'>(
		selectedItems: FilterElement[],
		valueType: T = 'number' as T
	): ValueTypeMap[T][] => {
		const selectedValues: ValueTypeMap[T][] = [];
		for (const item of selectedItems) {
			if (item.type === 'checkbox' && typeof item.value === valueType) {
				selectedValues.push(item.value as ValueTypeMap[T]);
			}
		}
		return selectedValues;
	};

	// Extracts tag ID from a filter, handling both number and Tag object cases
	const getFilterTagId = (filter: Filter) => {
		const tagId =
			typeof filter.tag !== 'undefined'
				? typeof filter.tag === 'number'
					? filter.tag
					: filter.tag?.id
				: undefined;
		return tagId;
	};

	// Converts filter's product types to consistent format, removing nullish values
	const getFilterProductTypes = (filter?: Filter) => {
		return (filter?.productTypes || []).map(getApiObject).filter(filterNullish);
	};

	// Converts filters to checkbox elements for tags filtering
	const tagsFilterSections: Section[] = $derived.by(() => {
		const tags = props.filters.map((it) => {
			const tagId = getFilterTagId(it);
			return { type: 'checkbox', value: tagId || -1, label: it.label } as FilterElement;
		});

		const additionalTags = additionalFilters.map(
			(it) =>
				({
					type: 'checkbox',
					value: it.tag?.id,
					label: it.label
				}) as FilterElement
		);

		return [
			{ title: 'CLOTHING', elements: tags },
			...additionalTags.map((it) => ({
				elements: [{ ...it, label: it.label?.toLocaleUpperCase() }]
			}))
		];
	});

	// Converts brands to checkbox elements
	const brandsFilterElements: FilterElement[] = $derived.by(() => {
		return props.brands.map((it) => {
			return { type: 'checkbox', value: it.id, label: it.title };
		});
	});

	let onSelectDebounceTimeout: NodeJS.Timeout | undefined = undefined;

	// Triggers callback whenever any selection changes
	$effect(() => {
		const values = {
			entities: selectedEntities,
			brands: selectedBrands,
			tags: selectedTags,
			productTypes: selectedProductTypes
		};

		if (onSelectDebounceTimeout) {
			clearTimeout(onSelectDebounceTimeout);
		}

		onSelectDebounceTimeout = setTimeout(() => {
			props.onSelected?.(values);
		}, 10);
	});
</script>

<form class="home-filters" aria-label="Product filters">
	<!-- Entity selection filter -->
	<Filters
		radio
		sections={[
			{
				title: 'BOUTIQUES',
				elements: props.entities.map((it) => ({ type: 'checkbox', label: it.title, value: it.id }))
			}
		]}
		onSelected={(items) => (selectedEntities = getSelectedValues(items))}
	/>

	<!-- Tag selection filter - resets product types when changed -->
	<div class="home-filters__section home-filters__tags">
		<Filters
			radio
			sections={tagsFilterSections}
			onSelected={(items) => {
				const firstItem = items[0];
				selectedProductTypes = [];
				selectedTags = [];
				if (
					typeof firstItem !== 'undefined' &&
					firstItem.type === 'checkbox' &&
					typeof firstItem.value === 'number'
				) {
					selectedTags = [firstItem.value];
				}
			}}
		/>

		<div class="home-filters__additional home-filters__brands">
			<Select
				fillWidth
				label="Brands"
				clearSelection={true}
				borderColor="var(--light-gray)"
				onselect={(res) => (selectedBrands = typeof res?.value === 'number' ? [res.value] : [])}
				options={[
					{
						label: 'brands',
						showLabel: false,
						values: props.brands.map((it) => ({
							label: it.title,
							value: it.id
						}))
					}
				]}
			/>
		</div>
	</div>

	<!-- Product type filters - only shown for selected tag -->
	{#each props.filters as filter}
		{#if selectedTags.includes(getFilterTagId(filter) || CUSTOM_UNDEFINED_TAG_ID) && getFilterProductTypes(filter).length > 0}
			<Filters
				radio
				sections={[
					{
						elements: getFilterProductTypes(filter).map((it) => ({
							type: 'checkbox',
							value: it.id,
							label: it.title
						}))
					}
				]}
				onSelected={(items) => (selectedProductTypes = getSelectedValues(items))}
			/>
		{/if}
	{/each}
</form>

<style lang="scss">
	.home-filters {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		justify-content: flex-end;

		&__section {
			display: flex;
			gap: 0.5rem;
		}

		&__additional {
			display: flex;
		}

		&__brands {
			width: 10rem;

			:global(button) {
				padding: var(--filters-padding);
				font-size: 1rem;
				justify-content: left;
			}
		}

		&__tags {
			flex-direction: row;
			flex-wrap: wrap;
		}

		@media screen and (max-width: 800px) {
			:global(fieldset) {
				flex: 1 1 auto;
			}
		}
	}
</style>
