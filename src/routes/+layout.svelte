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
	@font-face {
		font-family: Lescargot;
		src: url(/fonts/LESCARGOT-Regular.otf);
		font-weight: normal;
	}

	@font-face {
		font-family: ACaslonPro;
		src: url(/fonts/ACaslonPro-Regular.otf);
		font-weight: normal;
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
	}
</style>
