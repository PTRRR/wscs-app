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
	:global(html, body) {
		min-height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
