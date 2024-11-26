<script lang="ts">
	import { type Snippet } from 'svelte';
	import { filterNullish } from '../utilities/iterables';

	interface ButtonProps {
		'aria-label'?: string;
		children: Snippet;
		onclick?: () => void;
		onintersect?: (intersecting: boolean) => void;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary';
		class?: string;
		disabled?: boolean;
	}

	const {
		children,
		onintersect,
		onclick,
		'aria-label': ariaLabel,
		type = 'button',
		variant = 'primary',
		class: className = '',
		disabled = false
	}: ButtonProps = $props();

	let buttonElement: HTMLButtonElement | undefined = $state(undefined);

	$effect(() => {
		if (!onintersect || !buttonElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries.find((entry) => entry.target === buttonElement);
				if (entry) {
					onintersect(entry.isIntersecting);
				}
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: [0, 0.5, 1]
			}
		);

		observer.observe(buttonElement);
		return () => observer.disconnect();
	});

	const buttonClasses = $derived(
		[
			'button',
			`${className}`,
			variant ? `button--${variant}` : '',
			disabled ? 'button--disabled' : ''
		]
			.filter(filterNullish)
			.join(' ')
	);
</script>

<button
	{type}
	{disabled}
	{onclick}
	bind:this={buttonElement}
	aria-label={ariaLabel}
	class={buttonClasses}
	data-variant={variant}
>
	<span class="button__inner">
		{@render children()}
	</span>
</button>

<style lang="scss">
	:root {
		--button-primary-bg: #ffffff;
		--button-primary-color: #000000;
		--button-primary-border: #000000;
		--button-hover-bg: #000000;
		--button-hover-color: #ffffff;
		--button-disabled-opacity: 0.6;
		--button-border-radius: 4px;
		--button-padding: 0.4rem 0.5rem;
	}

	.button {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background-color: var(--button-primary-bg);
		color: var(--button-primary-color);
		border: 1px solid var(--button-primary-border);
		border-radius: var(--button-border-radius);
		padding: var(--button-padding);
		text-transform: uppercase;
		font-family: inherit;
		font-size: 0.7rem;
		line-height: 1;
		transition: all 0.2s ease-in-out;

		/* &:focus {
			outline: 1px solid var(--button-primary-border);
			outline-offset: 2px;
		} */

		&:hover:not(.button--disabled) {
			color: var(--button-hover-color);
			background-color: var(--button-hover-bg);
		}

		&--disabled {
			opacity: var(--button-disabled-opacity);
			cursor: not-allowed;
			pointer-events: none;
		}

		&__inner {
			transform: translate(0, 5%);
			// Improve text rendering
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
	}

	@media print {
		.button {
			border: 1px solid #000;
			background: none;
			color: #000;
		}
	}
</style>
