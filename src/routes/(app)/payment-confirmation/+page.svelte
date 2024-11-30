<script lang="ts">
	import { onMount } from 'svelte';
	import { useLocalCart } from '../../../store';

	const { cart } = useLocalCart();

	$effect(() => {
		if ($cart.items.length > 0) {
			cart.set({ items: [] });
		}
	});
</script>

<h1>Payment successful</h1>
