<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	type Value = {
		id?: string | number | null;
		label?: string | null;
		value: string | number;
	};

	const props: {
		options: {
			label: string;
			showLabel?: boolean;
			values: Value[];
		}[];
		label: string;
		fillWidth?: boolean;
		onselect?: (value?: Value) => void;
		clearSelection?: boolean;
		defaultSelected?: Value;
	} = $props();

	const { options } = props;

	const {
		elements: { trigger, menu, option, group, groupLabel },
		states: { selectedLabel, open, selected }
	} = createSelect<string>({
		forceVisible: true,
		defaultSelected: props.defaultSelected
			? {
					label: props.defaultSelected.label || undefined,
					value: props.defaultSelected.value.toString()
				}
			: undefined,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});

	selected.subscribe((value) => {
		const allValues = props.options.map((it) => it.values).flat();
		const selectedValue = allValues.find((it) => it.value === value?.value);
		props.onselect?.(typeof selectedValue !== 'undefined' ? selectedValue : undefined);
	});
</script>

<div class="select" class:select--fill-width={props.fillWidth}>
	<button use:melt={$trigger}>
		<span class="select__button-inner">
			{$selectedLabel || props.label}
		</span>
	</button>
	{#if $open}
		<div class="select__menu" use:melt={$menu} transition:fade={{ duration: 150 }}>
			{#each options as { label, values, showLabel }}
				<div use:melt={$group(label)} class="select__group">
					{#if showLabel}
						<div class="select__group-label" use:melt={$groupLabel(label)}>
							{label}
						</div>
					{/if}

					{#if props.clearSelection}
						<button
							class="select__option"
							onclick={() => {
								$open = false;
								$selected = undefined;
							}}
						>
							Clear selection
						</button>
					{/if}

					{#each values as { value, label }}
						<button
							class="select__option"
							use:melt={$option({ value, label: label || value.toString() })}
						>
							{label || value}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.select {
		display: contents;

		&--fill-width {
			button {
				width: 100%;
			}
		}

		&__menu {
			overflow: auto;
		}

		&__group {
			display: flex;
			flex-direction: column;
			gap: 0.1rem;
		}

		&__option {
			width: 100%;
		}

		&__button-inner {
			transform: translate(0, 5%);
			// Improve text rendering
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
	}
</style>
