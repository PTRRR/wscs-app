<script lang="ts">
	import Button from './Button.svelte';

	const props: {
		href?: string;
		onclick?: () => void;
	} = $props();
</script>

{#if props.href}
	<a class="read-more" href={props.href} onclick={props.onclick}>More</a>
{:else}
	<Button minimal class="read-more" onclick={props.onclick}>More</Button>
{/if}

<style lang="scss">
	:global(.read-more) {
		position: relative;
		text-transform: uppercase;
		text-decoration: none;
		color: #ad0000;
		font-size: 0.8rem;
		line-height: 1;
		height: 1em;
		max-width: fit-content;

		&:hover {
			color: grey;
		}

		&::before {
			content: '';
			position: absolute;
			bottom: -0.2em;
			left: 0;
			width: calc(100% + 0.7em);
			border-bottom: 1px solid;
			border-color: inherit;
		}

		&::after {
			content: '';
			width: 0.6em;
			height: 0.6em;
			border-top: solid 1px;
			border-right: solid 1px;
			border-color: inherit;
			position: absolute;
			top: calc(50% - 0.2em);
			left: calc(100% + 0.6em);
			transform: translate(-100%, -50%) rotate(45deg);
		}
	}
</style>
