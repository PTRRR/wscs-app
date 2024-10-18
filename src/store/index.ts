import { get, readable, writable, type Writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import type { PartialBy } from '../utilities/types';
import type { User } from '../utilities/api/types';
import { createQuery, QueryClient } from '@tanstack/svelte-query';
import { WSCS } from '../utilities/api';
import type { Cart, CartItem } from './types';

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

export const useUser = (baseUrl?: string) => {
	const api = new WSCS(baseUrl);
	const key = 'user';

	const query = createQuery({
		queryKey: [key],
		queryFn: () => api.me(),
		refetchInterval: 30000
	});

	const invalidate = (queryClient: QueryClient) => {
		queryClient.invalidateQueries({ queryKey: [key] });
	};

	return { query, invalidate };
};

export const useLocalCart = () => {
	const cart = useWritable<Cart>('local-cart', { items: [] }, true);

	const addToCart = (cartItem: CartItem) => {
		cart.update((cart) => ({
			...cart,
			items: [...(cart?.items || []), cartItem]
		}));
	};

	const removeFromCart = (cartItem: PartialBy<CartItem, 'quantity'>) => {
		cart.update((cart) => ({
			...cart,
			items: (cart?.items || []).filter(
				(item) => item.product !== cartItem.product || item.variation !== cartItem.variation
			)
		}));
	};

	return {
		cart,
		addToCart,
		removeFromCart
	};
};
