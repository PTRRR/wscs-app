<script lang="ts">
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { css } from '../utilities/css';

	let step = 0.4;
	let currentProgress = 0;
	let progress: number = 0;
	let completed: boolean = false;

	let unsubscribe = navigating.subscribe(async (value) => {
		completed = false;
		progress = 0;

		const interval = setInterval(() => {
			currentProgress += step;
			progress = Math.round((Math.atan(currentProgress) / (Math.PI / 2)) * 100 * 1000) / 1000;

			if (progress >= 100) {
				clearInterval(interval);
			} else if (progress >= 70) {
				step = 0.1;
			}
		}, 150);

		await value?.complete;

		clearInterval(interval);

		progress = 100;
		completed = true;

		setTimeout(() => {
			progress = 0;
		}, 500);
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="loading-bar" class:loading-bar--completed={completed}>
	<div
		class="loading-bar__content"
		style={css({
			width: `${progress}%`
		})}
	></div>
</div>

<style>
	.loading-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		transition: all 0.5s;
		pointer-events: none;
		z-index: 10000;
	}

	.loading-bar--completed {
		opacity: 0;
	}

	.loading-bar__content {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background-color: black;
		transition: all 0.3s;
	}
</style>
