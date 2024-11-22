<script lang="ts">
	import type { Brand, Entity, Filter } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import Filters, { type FilterElement } from './Filters.svelte';

	const props: {
		entities: Entity[];
		brands: Brand[];
		filters: Filter;
		onSelected?: (selection: {
			entities: number[];
			categories: string[];
			productTypes: number[];
			brands: number[];
		}) => void;
	} = $props();

	const menProductTypes = (props.filters.menProductTypes || [])
		.map(getApiObject)
		.filter(filterNullish);

	const womenProductTypes = (props.filters.womenProductTypes || [])
		.map(getApiObject)
		.filter(filterNullish);

	const accessoriesProductTypes = (props.filters.accessoriesProductTypes || [])
		.map(getApiObject)
		.filter(filterNullish);

	const campingProductTypes = (props.filters.campingProductTypes || [])
		.map(getApiObject)
		.filter(filterNullish);

	let selectedEntities = $state<number[]>([]);
	let selectedCategories = $state<string[]>([]);
	let selectedProductTypes = $state<number[]>([]);
	let selectedBrands = $state<number[]>([]);

	type ValueTypeMap = {
		number: number;
		string: string;
	};

	const getSelectedValues = <T extends keyof ValueTypeMap = 'number'>(
		selectedItems: FilterElement[],
		valueType: T
	): ValueTypeMap[T][] => {
		const selectedValues: ValueTypeMap[T][] = [];

		for (const item of selectedItems) {
			if (item.type === 'checkbox' && typeof item.value === valueType) {
				selectedValues.push(item.value as ValueTypeMap[T]);
			}
		}

		return selectedValues;
	};

	$effect(() => {
		props.onSelected?.({
			entities: selectedEntities,
			brands: selectedBrands,
			categories: selectedCategories,
			productTypes: selectedProductTypes
		});
	});
</script>

<div class="home-filters">
	<Filters
		radio
		items={props.entities.map((it) => ({ type: 'checkbox', label: it.title, value: it.id }))}
		onSelected={(items) => (selectedEntities = getSelectedValues(items, 'number'))}
	/>

	<Filters
		radio
		items={[
			{
				type: 'checkbox',
				value: 'all',
				label: 'All products',
				default: true
			},
			{
				type: 'checkbox',
				value: 'men',
				label: 'Men'
			},
			{
				type: 'checkbox',
				value: 'women',
				label: 'Women'
			},
			{
				type: 'checkbox',
				value: 'kids',
				label: 'Kids'
			},
			{
				type: 'checkbox',
				value: 'accessories',
				label: 'Accessories'
			},
			{
				type: 'checkbox',
				value: 'camping',
				label: 'Camping'
			},
			{
				type: 'checkbox',
				value: 'shoes',
				label: 'Shoes'
			},
			{
				type: 'checkbox',
				value: 'brands',
				label: 'Brands'
			}
		]}
		onSelected={(items) => {
			const firstItem = items[0];
			selectedProductTypes = [];

			if (
				typeof firstItem !== 'undefined' &&
				firstItem.type === 'checkbox' &&
				typeof firstItem.value === 'string'
			) {
				selectedCategories = [firstItem.value];
			} else {
				selectedCategories = [];
			}
		}}
	/>

	{#if selectedCategories.includes('men')}
		<Filters
			items={menProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(items) => (selectedProductTypes = getSelectedValues(items, 'number'))}
		/>
	{:else if selectedCategories.includes('women')}
		<Filters
			items={womenProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(items) => (selectedProductTypes = getSelectedValues(items, 'number'))}
		/>
	{:else if selectedCategories.includes('camping')}
		<Filters
			items={campingProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(items) => (selectedProductTypes = getSelectedValues(items, 'number'))}
		/>
	{:else if selectedCategories.includes('accessories')}
		<Filters
			items={accessoriesProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(items) => (selectedProductTypes = getSelectedValues(items, 'number'))}
		/>
	{:else if selectedCategories.includes('brands')}
		<Filters
			items={props.brands.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(items) => (selectedBrands = getSelectedValues(items, 'number'))}
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
