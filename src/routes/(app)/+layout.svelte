<script lang="ts">
	import { onMount } from 'svelte';
	import { useLocalCart, useUser } from '../../store';
	import type { LayoutData } from './$types';
	import { WSCS } from '../../utilities/api';
	import type { User } from '../../utilities/api/types';
	import type { Cart, CartItem } from '../../store/types';

	export let data: LayoutData;

	const api = new WSCS(data.api.baseUrl);

	let isCartInitialized = false;

	const { cart } = useLocalCart();
	const { query: user } = useUser(data.api.baseUrl);

	const mergeCarts = (localCart: Cart, remoteCart: User['cart']): Cart => {
		const mergedItems: CartItem[] = [
			...(remoteCart?.items || []).map((item) => ({
				product: (typeof item.product === 'object' ? item.product?.id : item.product) || 0,
				variation: (typeof item.variation === 'object' ? item.variation?.id : item.variation) || 0,
				quantity: item.quantity || 0
			}))
		];

		localCart.items.forEach((localItem) => {
			const remoteItem = mergedItems.find(
				(remoteItem) =>
					remoteItem.product === localItem.product && remoteItem.variation === localItem.variation
			);

			if (!remoteItem) {
				mergedItems.push(localItem);
			}
		});

		return { items: mergedItems };
	};

	onMount(() => {
		let debounceCartUpdate: NodeJS.Timeout | undefined = undefined;

		cart.subscribe((cart) => {
			const user = $user.data?.user;

			if (user && isCartInitialized) {
				console.log('caaaaart', cart);
				if (debounceCartUpdate) clearTimeout(debounceCartUpdate);
				debounceCartUpdate = setTimeout(
					() => api.updateCart({ userId: user.id, cart }).then((res) => console.log(res)),
					500
				);
			}
		});

		user.subscribe(async ({ data }) => {
			const user = data?.user;

			if (user && !isCartInitialized) {
				const merged = mergeCarts($cart, user.cart);

				console.log(merged);

				$cart = merged;

				api
					.updateCart({
						userId: user.id,
						cart: merged
					})
					.finally(() => (isCartInitialized = true));
			} else if (!user && isCartInitialized) {
				isCartInitialized = false;
			}
		});
	});
</script>

<a href="/">Home</a>
<a href="/checkout">Checkout</a>
<a href="/login">Login</a>

{#if $user.isSuccess && $user.data.user}
	<a href="/logout">Logout</a>
{/if}
<slot />
