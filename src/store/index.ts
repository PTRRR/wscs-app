import { readable, writable, type Writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import type { Cart, CartItem } from './types';
import type { PartialBy } from '../utilities/types';
import type { User } from '../utilities/api/types';

const STORE_PREFIX = 'WSCS';
const STORE_VERSION = 'v1.0.0';

const getStoreName = (name: string) => `${STORE_PREFIX}-${name}-${STORE_VERSION}`;

export const useSharedStore = <T, A>(name: string, fn: (value?: A) => T, defaultValue?: A) => {
	if (hasContext(name)) {
		return getContext<T>(name);
	}
	const _value = fn(defaultValue);
	setContext(name, _value);
	return _value;
};

export const useWritable = <T>(name: string, value: T, persist: boolean = false) => {
	const storeName = getStoreName(name);
	const sharedStore = useSharedStore(storeName, writable, value) as Writable<T>;

	if (typeof window !== 'undefined' && persist) {
		const storedValue = window.localStorage.getItem(storeName);
		if (!storedValue) {
			window.localStorage.setItem(storeName, JSON.stringify({ value: undefined }));
		} else {
			sharedStore.set(JSON.parse(storedValue).value);
		}

		sharedStore.subscribe((value) => {
			if (typeof value !== 'undefined') {
				window.localStorage.setItem(storeName, JSON.stringify({ value }));
			}
		});
	}

	return sharedStore;
};
export const useReadable = <T>(name: string, value: T) => useSharedStore(name, readable, value);

// Stores

export const useUser = () => {
	const user = useWritable<User | undefined>('user', undefined, false);
	return { user };
};

export const useCart = () => {
	const cart = useWritable<Cart>('cart', { items: [] }, true);

	const addToCart = (cartItem: CartItem) => {
		cart.update((cart) => ({
			...cart,
			items: [...cart.items, cartItem]
		}));
	};

	const removeFromCart = (cartItem: PartialBy<CartItem, 'price' | 'quantity'>) => {
		cart.update((cart) => ({
			...cart,
			items: cart.items.filter(
				(item) => item.productId !== cartItem.productId || item.variationId !== cartItem.variationId
			)
		}));
	};

	return {
		cart,
		addToCart,
		removeFromCart
	};
};
