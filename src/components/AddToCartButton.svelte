<script lang="ts">
	import { goto } from '$app/navigation';
	import { useCart } from '../store';
	import type { CartItem } from '../store/types';
	import type { PartialBy } from '../utilities/types';

	export let productId: string | number;
	export let variationId: string | number;
	export let quantity: number = 1;
	export let price: number = 0;
	export let goToCart: boolean = false;

	const { cart, addToCart, removeFromCart } = useCart();

	$: isInCart = (cartItem: PartialBy<CartItem, 'price' | 'quantity'>) =>
		Boolean(
			$cart.items.find(
				(it) => it.productId === cartItem.productId && it.variationId === cartItem.variationId
			)
		);

	$: message = isInCart({ productId, variationId }) ? 'Remove from cart' : 'Add to cart';
</script>

<div class="add-to-cart">
	<button
		class="add-to-cart__button"
		on:click={() => {
			isInCart({ productId, variationId })
				? removeFromCart({
						productId,
						variationId
					})
				: addToCart({
						productId,
						variationId,
						quantity,
						price
					});

			if (goToCart) {
				goto('/checkout');
			}
		}}
	>
		{message}
	</button>
</div>

<style lang="scss">
	.add-to-cart {
		&__button {
			cursor: pointer;
		}
	}
</style>
