<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	type Value = {
		label?: string;
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
	} = $props();

	const { options } = props;

	const {
		elements: { trigger, menu, option, group, groupLabel },
		states: { selectedLabel, open, selected }
	} = createSelect<string>({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		}
	});

	selected.subscribe((value) => {
		props.onselect?.(
			typeof value?.value !== 'undefined'
				? {
						label: value?.label,
						value: value?.value
					}
				: undefined
		);
	});
</script>

<div class="select" class:select--fill-width={props.fillWidth}>
	<label for="" class="select__label"></label>
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
