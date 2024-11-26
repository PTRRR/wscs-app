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
	.button {
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
