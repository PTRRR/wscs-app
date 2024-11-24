import type { Product } from './api/types';

export type TypesenseConfig = {
	apiKey: string;
	nodes: {
		host: string;
		port: number;
		protocol: string;
	}[];
};

export type Hit<T> = {
	document: T;
};

export type SearchProduct = Omit<Product, 'id'> & { id: string };

export const searchProductToProduct = (product: SearchProduct): Product => ({
	...product,
	id: parseInt(product.id)
});
