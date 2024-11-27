<script lang="ts">
	import type { Attribute, Variation } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { css } from '../utilities/css';
	import { filterNullish } from '../utilities/iterables';
	import Select from './Select.svelte';

	const props: { variations: Variation[] } = $props();

	const attributes = $derived(
		Object.values(
			props.variations
				.map((it) => it.attributes?.map((it) => getApiObject(it)).filter(filterNullish) || [])
				.flat()
				.reduce<Record<number, Attribute>>((acc, it) => {
					acc[it.id] = it;
					return acc;
				}, {})
		)
	);

	type Selection = Record<number, { label?: string | null; value: string | number } | undefined>;
	let selection = $state<Selection>({});

	const reduceValues = <T extends { value?: string | null }>(values: T[]) => {
		const reducedValues = new Map<string | undefined | null, T>();
		values.forEach((it) => reducedValues.set(it.value, it));
		return Array.from(reducedValues.values());
	};

	const getValueForAttribute = (attribute: Attribute) => {
		return selection[attribute.id];
	};

	const getAttributeLabel = (attribute: Attribute) =>
		`${attribute.label}: ${
			getValueForAttribute(attribute)?.label || getValueForAttribute(attribute)?.value
		}`;

	$effect(() => {
		const initialSelection = attributes.reduce<Selection>((acc, it) => {
			if (it.type === 'colors') {
				acc[it.id] = it.colors?.[0];
			} else if (it.type === 'options') {
				acc[it.id] = it.options?.[0];
			} else if (it.type === 'text') {
				acc[it.id] = it.options?.[0];
			}
			return acc;
		}, {});

		selection = initialSelection;
	});

	$effect(() => {
		$inspect(selection);
	});
</script>

<div class="product-attributes">
	{#each attributes as attribute}
		<div class="product-attributes__attribute">
			<span>{getAttributeLabel(attribute)}</span>
			{#if attribute.type === 'colors'}
				<div class="product-attributes__colors">
					{#each reduceValues(attribute.colors || []) as color}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							onclick={() => {
								selection[attribute.id] = color;
							}}
							class="product-attributes__color"
							style={css({
								backgroundColor: color.value
							})}
						></div>
					{/each}
				</div>
			{:else if attribute.type === 'options'}
				<Select
					label={attribute.label}
					defaultSelected={attribute.options?.[0]}
					options={[
						{
							label: attribute.label,
							showLabel: false,
							values: reduceValues(attribute.options || [])
						}
					]}
					onselect={(value) => {
						selection[attribute.id] = value;
					}}
				/>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.product-attributes {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;

		&__attribute {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}

		&__colors {
			display: flex;
			gap: 0.5rem;
		}

		&__color {
			width: 30px;
			height: 30px;
			border: solid 1px black;
			cursor: pointer;
		}
	}
</style>
