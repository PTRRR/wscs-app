<script context="module">
	export const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>

<style>
	:root {
		--main-padding: 1.5rem;

		--button-primary-bg: #ffffff;
		--button-primary-color: #000000;
		--button-primary-border: #000000;
		--button-hover-bg: #000000;
		--button-hover-color: #ffffff;
		--button-disabled-opacity: 0.3;
		--button-border-radius: 4px;
		--button-padding: 0.4rem 0.5rem;
	}

	@font-face {
		font-family: Lescargot;
		src: url(/fonts/LESCARGOT-Regular.otf);
		font-weight: normal;
		font-display: swap;
	}

	@font-face {
		font-family: ACaslonPro;
		src: url(/fonts/ACaslonPro-Regular.otf);
		font-weight: normal;
		font-display: swap;
	}

	:global(html, body) {
		font-family: ACaslonPro;
		min-height: 100%;
		margin: 0;
		padding: 0;
	}

	:global(*) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		box-sizing: border-box;
	}

	:global(button) {
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
		font-size: 0.8rem;
		line-height: 1;
		transition: all 0.2s ease-in-out;

		&:hover {
			color: var(--button-hover-color);
			background-color: var(--button-hover-bg);
		}
	}
</style>
