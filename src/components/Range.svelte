<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';
	import { css } from '../utilities/css';

	let {
		value = $bindable(0),
		max,
		min,
		step,
		pips,
		title
	}: {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		pips?: boolean;
		title?: string;
	} = $props();

	const defaultMax = max || 4;
	const defaultMin = min || 0;
	const defaultStep = step || 1;

	const {
		elements: { root, range, thumbs },
		states: { value: rangeValue }
	} = createSlider({
		defaultValue: [value || 0],
		min: defaultMin,
		max: defaultMax,
		step: defaultStep
	});

	rangeValue.subscribe((newValue) => {
		value = newValue[0];
	});

	const thumbWidth = 20;
	const thumbHeight = 15;
</script>

<span class="range">
	{#if title}
		<span class="range__title">{title}</span>
	{/if}

	<span
		use:melt={$root}
		class="range__wrapper"
		style={css({
			'--thumb-height': `${thumbHeight}px`
		})}
	>
		<span class="range__track">
			<span use:melt={$range} class="range__track-tail"></span>
		</span>

		<span use:melt={$thumbs[0]} class="range__thumb">
			<svg
				width={thumbWidth}
				height={thumbHeight}
				viewBox={`0 0 ${thumbWidth} ${thumbHeight}`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d={`M 0 0 L ${thumbWidth} 0 L ${thumbWidth * 0.5} ${thumbHeight} Z`} fill="black" />
			</svg>
		</span>

		{#if pips}
			<div class="range__pips">
				{#each { length: defaultMax - defaultMin + 1 } as _, i}
					<div class="range__pip"></div>
				{/each}
			</div>
		{/if}
	</span>
</span>

<style lang="scss">
	.range {
		&__wrapper {
			position: relative;
			align-items: center;
			display: flex;
			height: 20px;
			cursor: pointer;
		}

		&__title {
			display: block;
			white-space: nowrap;
			text-transform: uppercase;
			margin-bottom: 0.5rem;
		}

		&__track {
			width: 100%;
			height: 1px;
			background-color: black;
		}

		&__track-tail {
			height: 1px;
			background-color: black;
		}

		&__thumb {
			display: flex;
			align-items: center;
			justify-content: center;
			height: calc(var(--thumb-height) * 2);
			cursor: pointer;

			&:focus {
				outline: none;
			}

			svg {
				pointer-events: none;
				transform: translate(0, -50%);
			}
		}

		&__pips {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			height: 0;
			display: flex;
			justify-content: space-between;
		}

		&__pip {
			height: 10px;
			width: 1px;
			background-color: black;
			transform: translate(0, -100%);
		}
	}
</style>
