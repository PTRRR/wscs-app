<script lang="ts">
	import { useCart } from '../store';
	import type { CartItem } from '../store/types';
	import type { PartialBy } from '../utilities/types';

	export let productId: string | number;
	export let quantity: number = 1;
	export let price: number = 0;

	const { cart, addToCart, removeFromCart } = useCart();

	$: isInCart = (cartItem: PartialBy<CartItem, 'price' | 'quantity'>) =>
		Boolean($cart.items.find((it) => it.productId === cartItem.productId));
</script>

<div class="add-to-cart">
	<button
		class="add-to-cart__button"
		on:click={() =>
			isInCart({ productId })
				? removeFromCart({
						productId
					})
				: addToCart({
						productId,
						quantity,
						price
					})}
	>
		{isInCart({ productId }) ? 'Remove from cart' : 'Add to cart'}
	</button>
</div>

<style lang="scss">
	.add-to-cart {
		&__button {
			cursor: pointer;
		}
	}
</style>
