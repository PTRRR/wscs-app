<script lang="ts">
	import { useCart } from '../../store';
	import { findVariationById, findVariations } from '../../utilities/api';
	import type { Variation } from '../../utilities/api/types';

	const { cart } = useCart();

	let products: Variation[] = [];

	$: {
		const productIds = $cart.items.map((item) => item.productId);
		console.log(productIds);
		Promise.all(productIds.map((id) => findVariationById(id))).then((res) => {
			console.log(res);
			products = res;
		});
		// findVariations({
		// 	parent: {
		// 		exists: true
		// 	},
		// 	id: {
		// 		in: productIds.join(',')
		// 	}
		// }).then(({ docs }) => (products = docs));
	}
</script>

<h1>Checkout</h1>

{#each products as product}
	<div class="cart-item">
		<p>{product.name}</p>
		<p>{product.price}</p>
	</div>
{/each}
