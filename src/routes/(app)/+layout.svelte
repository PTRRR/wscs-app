<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { useLocalCart, useSearchEngine, useUser } from '../../store';
	import type { LayoutData } from './$types';
	import { WSCS } from '../../utilities/api';
	import type { User } from '../../utilities/api/types';
	import type { Cart, CartItem } from '../../store/types';
	import MainMenu from '../../components/MainMenu.svelte';

	const props: {
		children: Snippet;
		data: LayoutData;
	} = $props();

	const { data, children } = props;

	const { loadSearchKey } = useSearchEngine(
		data.api.baseUrl,
		data.typesense.productsCollection,
		data.typesense.clientConfig
	);

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

		let lastCart: Cart | undefined = undefined;

		cart.subscribe((cart) => {
			if (JSON.stringify(lastCart) === JSON.stringify(cart)) return;
			const userData = $user.data?.user;

			if (userData && isCartInitialized) {
				if (debounceCartUpdate) clearTimeout(debounceCartUpdate);
				debounceCartUpdate = setTimeout(() => api.updateCart({ userId: userData.id, cart }), 500);
			}

			lastCart = cart;
		});

		user.subscribe(async ({ data }) => {
			const user = data?.user;

			if (user && !isCartInitialized) {
				const merged = mergeCarts($cart, user.cart);
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

		loadSearchKey();
	});
</script>

<MainMenu />

{@render children()}
