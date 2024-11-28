<script lang="ts">
	import type { Attribute, Variation } from '../utilities/api/types';
	import { getApiObject } from '../utilities/api/utils';
	import { css } from '../utilities/css';
	import { filterNullish } from '../utilities/iterables';
	import Select from './Select.svelte';

	type Selection = Record<
		string,
		{ id?: string | number | null; label?: string | null; value: string | number } | undefined
	>;

	const props: { variations: Variation[]; onselection?: (selection: Selection) => void } = $props();

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

	let selection = $state<Selection>({});

	const reduceValues = <T extends { value?: string | null }>(values: T[]) => {
		const reducedValues = new Map<string | undefined | null, T>();
		values.forEach((it) => reducedValues.set(it.value, it));
		return Array.from(reducedValues.values());
	};

	const getValueForAttribute = (attribute: Attribute) => {
		return selection[attribute.name];
	};

	const getAttributeLabel = (attribute: Attribute) =>
		`${attribute.label}: ${
			getValueForAttribute(attribute)?.label || getValueForAttribute(attribute)?.value
		}`;

	$effect(() => {
		const initialSelection = attributes.reduce<Selection>((acc, it) => {
			if (it.type === 'colors') {
				acc[it.name] = it.colors?.[0];
			} else if (it.type === 'options') {
				acc[it.name] = it.options?.[0];
			} else if (it.type === 'text') {
				acc[it.name] = it.options?.[0];
			}
			return acc;
		}, {});

		selection = initialSelection;
	});

	$effect(() => {
		props.onselection?.(selection);
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
								selection[attribute.name] = color;
							}}
							class="product-attributes__color"
							style={css({
								'--color': color.value,
								border:
									getValueForAttribute(attribute)?.value === color.value
										? '1px solid #000'
										: undefined
							})}
						></div>
					{/each}
				</div>
			{:else if attribute.type === 'options'}
				{#if reduceValues(attribute.options || []).length > 1}
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
							selection[attribute.name] = value;
						}}
					/>
				{/if}
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.product-attributes {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1.5rem;

		&__attribute {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		&__colors {
			display: flex;
			gap: 0.5rem;
		}

		&__color {
			width: 26px;
			height: 26px;
			border: solid 1px rgba(0, 0, 0, 0.2);
			box-sizing: border-box;
			cursor: pointer;
			position: relative;

			&::after {
				content: '';
				display: block;
				position: absolute;
				width: calc(100% - 4px);
				height: calc(100% - 4px);
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background-color: var(--color);
			}
		}

		:global(.select button) {
			min-width: 8rem;
		}
	}
</style>
