<script lang="ts">
	import type { Brand, Entity, ProductType, Tag } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import Filters, { type FilterElement } from './Filters.svelte';

	const CUSTOM_UNDEFINED_TAG_ID = -1;
	const CUSTOM_BRANDS_ID = -2;

	type Filter = {
		label?: string | null;
		tag?: (number | null) | Tag;
		productTypes?: (ProductType | number)[] | null;
		id?: string | null;
	};

	const props: {
		entities: Entity[];
		brands: Brand[];
		filters: Filter[];
		onSelected?: (selection: {
			entities: number[];
			tags: number[];
			productTypes: number[];
			brands: number[];
		}) => void;
	} = $props();

	let selectedEntities = $state<number[]>([]);
	let selectedTags = $state<number[]>([]);
	let selectedProductTypes = $state<number[]>([]);
	let selectedBrands = $state<number[]>([]);
	let showBrands = $state<boolean>(false);

	type ValueTypeMap = {
		number: number;
		string: string;
	};

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

	const getFilterTagId = (filter: Filter) => {
		const tagId =
			typeof filter.tag !== 'undefined'
				? typeof filter.tag === 'number'
					? filter.tag
					: filter.tag?.id
				: undefined;

		return tagId;
	};

	const getFilterProductTypes = (filter?: Filter) => {
		return (filter?.productTypes || []).map(getApiObject).filter(filterNullish);
	};

	const tagsFilterElements: FilterElement[] = $derived.by(() => {
		return props.filters.map((it) => {
			const tagId = getFilterTagId(it);
			return { type: 'checkbox', value: tagId || -1, label: it.label };
		});
	});

	const brandsFilterElements: FilterElement[] = $derived.by(() => {
		return props.brands.map((it) => {
			return { type: 'checkbox', value: it.id, label: it.title };
		});
	});

	$effect(() => {
		props.onSelected?.({
			entities: selectedEntities,
			brands: selectedBrands,
			tags: selectedTags,
			productTypes: selectedProductTypes
		});
	});
</script>

<div class="home-filters">
	<Filters
		radio
		items={props.entities.map((it) => ({ type: 'checkbox', label: it.title, value: it.id }))}
		onSelected={(items) => (selectedEntities = getSelectedValues(items))}
	/>

	<Filters
		radio
		items={[
			{
				type: 'checkbox',
				value: CUSTOM_UNDEFINED_TAG_ID,
				label: 'All products',
				default: true
			},
			...tagsFilterElements,
			{
				type: 'checkbox',
				value: CUSTOM_BRANDS_ID,
				label: 'Brands'
			}
		]}
		onSelected={(items) => {
			const firstItem = items[0];

			// Reset the filters
			showBrands = false;
			selectedProductTypes = [];
			selectedTags = [];

			if (
				typeof firstItem !== 'undefined' &&
				firstItem.type === 'checkbox' &&
				typeof firstItem.value === 'number' &&
				firstItem.value !== CUSTOM_UNDEFINED_TAG_ID &&
				firstItem.value !== CUSTOM_BRANDS_ID
			) {
				selectedTags = [firstItem.value];
			}

			if (
				typeof firstItem !== 'undefined' &&
				firstItem.type === 'checkbox' &&
				firstItem.value === CUSTOM_BRANDS_ID
			) {
				showBrands = true;
			}
		}}
	/>

	{#each props.filters as filter}
		{#if selectedTags.includes(getFilterTagId(filter) || CUSTOM_UNDEFINED_TAG_ID) && getFilterProductTypes(filter).length > 0}
			<Filters
				items={getFilterProductTypes(filter).map((it) => ({
					type: 'checkbox',
					value: it.id,
					label: it.title
				}))}
				onSelected={(items) => (selectedProductTypes = getSelectedValues(items))}
			/>
		{/if}
	{/each}

	{#if showBrands}
		<Filters
			items={brandsFilterElements}
			onSelected={(items) => (selectedBrands = getSelectedValues(items))}
		/>
	{/if}
</div>

<style lang="scss">
	.home-filters {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
</style>
