import path from 'path';
import qs from 'qs';

import type { Attribute, Category, Media, Product, ProductType, Tag, Variation } from './types';

export interface PayloadListResponse<T> {
	docs: T[];
	hasNextPage: boolean;
	hasPrevPage: boolean;
	limit: number;
	nextPage: number;
	page: number;
	pagingCounter: number;
	prevPage: number;
	totalDocs: number;
	totalPages: number;
}

export interface PayloadCreateResponse<T> {
	doc: T;
	message: string;
}

export interface PayloadError {
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any[];
	message: string;
}

export interface PayloadErrorResponse {
	errors: PayloadError[];
}

const fetchPayload = async <T>(url: string, init?: RequestInit): Promise<T> => {
	const res = await fetch(path.join('http://localhost:3000', url), init);
	const json = await res.json();
	return json as T;
};

export const findProductById = (id: string | number): Promise<Product> => {
	return fetchPayload<Product>(`/api/products/${id}`);
};

enum QueryOperators {
	'equals' = 'equals',
	'not_equals' = 'not_equals',
	'greater_than' = 'greater_than',
	'greater_than_equal' = 'greater_than_equal',
	'less_than' = 'less_than',
	'less_than_equal' = 'less_than_equal',
	'like' = 'like',
	'contains' = 'contains',
	'in' = 'in',
	'not_in' = 'not_in',
	'all' = 'all',
	'exists' = 'exists',
	'near' = 'near'
}

const getAuthHeaders = (
	contentType = 'application/json'
): { 'content-type': string; authorization: string } => ({
	'content-type': contentType,
	authorization: `users API-Key ${process.env.SCRIPT_PAYLOAD_API_KEY}`
});

export const findProducts = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Product>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Product>>(`/api/products${query ? serializedQuery : ''}`);
};

export const createProduct = (
	product: Partial<Product>
): Promise<PayloadCreateResponse<Partial<Product> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/products', {
		method: 'post',
		body: JSON.stringify(product),
		headers: getAuthHeaders()
	});
};

export const findVariations = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Variation>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Variation>>(
		`/api/variations${query ? serializedQuery : ''}`
	);
};

export const createVariation = (
	variation: Partial<Variation>
): Promise<PayloadCreateResponse<Partial<Variation> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/variations', {
		method: 'post',
		body: JSON.stringify(variation),
		headers: getAuthHeaders()
	});
};

export const findAttribute = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Attribute>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Attribute>>(
		`/api/attributes${query ? serializedQuery : ''}`
	);
};

export const createAttribute = (
	attribute: Partial<Attribute>
): Promise<PayloadCreateResponse<Partial<Attribute> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/attributes', {
		method: 'post',
		body: JSON.stringify(attribute),
		headers: getAuthHeaders()
	});
};

export const findMedias = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Media>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Media>>(`/api/media${query ? serializedQuery : ''}`);
};

export const createMedia = (
	media: Partial<Media>,
	file: Blob
): Promise<PayloadCreateResponse<Partial<Media> & Partial<PayloadErrorResponse>>> => {
	const formData = new FormData();
	formData.set('alt', media.alt);
	formData.set('mimeType', media.mimeType);
	formData.set('width', (media.width || 0).toString());
	formData.set('height', (media.height || 0).toString());
	formData.set('file', file, media.filename);

	return fetchPayload('/api/media', {
		method: 'post',
		body: formData,
		headers: {
			authorization: `users API-Key ${process.env.SCRIPT_PAYLOAD_API_KEY}`
		}
	});
};

export const findCategories = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Category>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Category>>(
		`/api/categories${query ? serializedQuery : ''}`
	);
};

export const createCategory = (
	category: Partial<Category>
): Promise<PayloadCreateResponse<Partial<Category> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/categories', {
		method: 'post',
		body: JSON.stringify(category),
		headers: getAuthHeaders()
	});
};

export const findTags = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<Tag>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<Tag>>(`/api/tags${query ? serializedQuery : ''}`);
};

export const createTag = (
	tag: Partial<Tag>
): Promise<PayloadCreateResponse<Partial<Tag> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/tags', {
		method: 'post',
		body: JSON.stringify(tag),
		headers: getAuthHeaders()
	});
};

export const findProductTypes = (
	query?: Record<string, { [key in QueryOperators]?: string }>
): Promise<PayloadListResponse<ProductType>> => {
	const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
	return fetchPayload<PayloadListResponse<ProductType>>(
		`/api/product-types${query ? serializedQuery : ''}`
	);
};

export const createProductType = (
	productType: Partial<ProductType>
): Promise<PayloadCreateResponse<Partial<ProductType> & Partial<PayloadErrorResponse>>> => {
	return fetchPayload('/api/product-types', {
		method: 'post',
		body: JSON.stringify(productType),
		headers: getAuthHeaders()
	});
};
