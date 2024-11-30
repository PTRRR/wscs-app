<script lang="ts">
	import Button from '../../../components/Button.svelte';
	import { useLocalCart } from '../../../store';

	const { cart } = useLocalCart();
</script>

<div class="cart">
	<h1>Cart</h1>

	{#if $cart.items.length > 0}
		<Button onclick={() => cart.set({ items: [] })}>Empty cart</Button>
	{/if}
</div>

<style lang="scss">
	.cart {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
