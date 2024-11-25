<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		onintersect,
		onclick
	}: { children: Snippet; onclick?: () => void; onintersect?: (intersecting: boolean) => void } =
		$props();

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

<button bind:this={buttonElement} {onclick}>
	{@render children()}
</button>
