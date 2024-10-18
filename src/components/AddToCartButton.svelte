<script lang="ts">
	import { goto } from '$app/navigation';
	import { useLocalCart } from '../store';
	import type { CartItem } from '../store/types';
	import type { PartialBy } from '../utilities/types';

	export let product: number;
	export let variation: number;
	export let quantity: number = 1;
	export let goToCart: boolean = false;

	const { cart, addToCart, removeFromCart } = useLocalCart();

	$: isInCart = (cartItem: PartialBy<CartItem, 'quantity'>) =>
		Boolean(
			$cart.items.find(
				(it) => it.product === cartItem.product && it.variation === cartItem.variation
			)
		);

	$: message = isInCart({ product, variation }) ? 'Remove from cart' : 'Add to cart';
</script>

<div class="add-to-cart">
	<button
		class="add-to-cart__button"
		on:click={() => {
			isInCart({ product, variation })
				? removeFromCart({
						product,
						variation
					})
				: addToCart({
						product,
						variation,
						quantity
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
