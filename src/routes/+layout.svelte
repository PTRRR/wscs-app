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
	import { useCart } from '../store';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';

	useCart();
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
