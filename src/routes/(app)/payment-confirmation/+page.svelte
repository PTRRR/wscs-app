<script lang="ts">
	import { onMount } from 'svelte';
	import { useLocalCart } from '../../../store';

	const { cart } = useLocalCart();

	onMount(() => {
		cart.set({ items: [] });
	});
</script>

<h1>Payment successful</h1>
