<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		onintersect,
		onclick,
		'aria-label': ariaLabel
	}: {
		'aria-label'?: string;
		children: Snippet;
		onclick?: () => void;
		onintersect?: (intersecting: boolean) => void;
	} = $props();

	let buttonElement: HTMLButtonElement | undefined = $state(undefined);

	$effect(() => {
		if (!onintersect || !buttonElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.target === buttonElement) {
						onintersect(entry.isIntersecting);
					}
				}
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 0
			}
		);

		observer.observe(buttonElement);

		return () => {
			observer.disconnect();
		};
	});
</script>

<button class="button" bind:this={buttonElement} {onclick} aria-label={ariaLabel}>
	<div class="button__inner">
		{@render children()}
	</div>
</button>

<style lang="scss">
	.button {
		position: relative;
		cursor: pointer;
		background-color: white;
		border: solid 1px black;
		border-radius: 4px;
		padding: 0.4rem 0.5rem;
		text-transform: uppercase;
		font-family: inherit;
		font-size: 0.7rem;
		line-height: 1;

		&:hover {
			color: white;
			background-color: black;
		}

		&__inner {
			transform: translate(0, 5%);
		}
	}
</style>
