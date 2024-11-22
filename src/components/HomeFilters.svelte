<script lang="ts">
	import type { Brand, Entity, Filter } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { filterNullish } from '../utilities/iterables';
	import Filters from './Filters.svelte';

	const props: {
		entities: Entity[];
		brands: Brand[];
		filters: Filter;
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

	let selectedFilterCategory = $state<string | undefined>(undefined);
</script>

<div class="home-filters">
	<Filters
		radio
		items={props.entities.map((it) => ({ type: 'checkbox', label: it.title, value: it.id }))}
		onSelected={(selectedItems) => console.log(selectedItems)}
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

			if (
				typeof firstItem !== 'undefined' &&
				firstItem.type === 'checkbox' &&
				typeof firstItem.value === 'string'
			) {
				selectedFilterCategory = firstItem.value;
			} else {
				selectedFilterCategory = undefined;
			}
		}}
	/>

	{#if selectedFilterCategory === 'men'}
		<Filters
			items={menProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(selectedItems) => console.log(selectedItems)}
		/>
	{:else if selectedFilterCategory === 'women'}
		<Filters
			items={womenProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
			onSelected={(selectedItems) => console.log(selectedItems)}
		/>
	{:else if selectedFilterCategory === 'camping'}
		<Filters
			items={campingProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
		/>
	{:else if selectedFilterCategory === 'accessories'}
		<Filters
			items={accessoriesProductTypes.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
		/>
	{:else if selectedFilterCategory === 'brands'}
		<Filters
			items={props.brands.map((it) => ({
				type: 'checkbox',
				value: it.id,
				label: it.title
			}))}
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
