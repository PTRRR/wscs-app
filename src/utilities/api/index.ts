import qs from 'qs';

import type { Attribute, Category, Media, Product, ProductType, Tag, Variation } from './types';
import { joinPaths } from '../urls';

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

export const enum QueryOperators {
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
): { 'content-type': string; authorization?: string } => ({
	'content-type': contentType
});

export class WSCS {
	constructor(private readonly baseUrl?: string) {}

	async fetchPayload<T>(url: string, init?: RequestInit): Promise<T> {
		const fullPath = joinPaths(this.baseUrl || 'http://localhost:3000', url);
		const res = await fetch(fullPath, init);
		const json = await res.json();
		return json as T;
	}

	findProductById(id: string | number): Promise<Product> {
		return this.fetchPayload<Product>(`/api/products/${id}`);
	}

	findProducts(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Product>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Product>>(
			`/api/products${query ? serializedQuery : ''}`
		);
	}

	createProduct(
		product: Partial<Product>
	): Promise<PayloadCreateResponse<Partial<Product> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/products', {
			method: 'post',
			body: JSON.stringify(product),
			headers: getAuthHeaders()
		});
	}

	findVariations(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Variation>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Variation>>(
			`/api/variations${query ? serializedQuery : ''}`
		);
	}

	findVariationById(id: string | number): Promise<Variation> {
		return this.fetchPayload<Variation>(`/api/variations/${id}`);
	}

	createVariation(
		variation: Partial<Variation>
	): Promise<PayloadCreateResponse<Partial<Variation> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/variations', {
			method: 'post',
			body: JSON.stringify(variation),
			headers: getAuthHeaders()
		});
	}

	findAttribute(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Attribute>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Attribute>>(
			`/api/attributes${query ? serializedQuery : ''}`
		);
	}

	createAttribute(
		attribute: Partial<Attribute>
	): Promise<PayloadCreateResponse<Partial<Attribute> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/attributes', {
			method: 'post',
			body: JSON.stringify(attribute),
			headers: getAuthHeaders()
		});
	}

	findMedias(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Media>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Media>>(
			`/api/media${query ? serializedQuery : ''}`
		);
	}

	createMedia(
		media: Partial<Media>,
		file: Blob
	): Promise<PayloadCreateResponse<Partial<Media> & Partial<PayloadErrorResponse>>> {
		const formData = new FormData();
		formData.set('alt', media.alt || '');
		formData.set('mimeType', media.mimeType || '');
		formData.set('width', (media.width || 0).toString());
		formData.set('height', (media.height || 0).toString());
		formData.set('file', file, media.filename || '');

		return this.fetchPayload('/api/media', {
			method: 'post',
			body: formData
		});
	}

	findCategories(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Category>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Category>>(
			`/api/categories${query ? serializedQuery : ''}`
		);
	}

	createCategory(
		category: Partial<Category>
	): Promise<PayloadCreateResponse<Partial<Category> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/categories', {
			method: 'post',
			body: JSON.stringify(category),
			headers: getAuthHeaders()
		});
	}

	findTags(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<Tag>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<Tag>>(`/api/tags${query ? serializedQuery : ''}`);
	}

	createTag(
		tag: Partial<Tag>
	): Promise<PayloadCreateResponse<Partial<Tag> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/tags', {
			method: 'post',
			body: JSON.stringify(tag),
			headers: getAuthHeaders()
		});
	}

	findProductTypes(
		query?: Record<string, { [key in QueryOperators]?: string }>
	): Promise<PayloadListResponse<ProductType>> {
		const serializedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });
		return this.fetchPayload<PayloadListResponse<ProductType>>(
			`/api/product-types${query ? serializedQuery : ''}`
		);
	}

	createProductType(
		productType: Partial<ProductType>
	): Promise<PayloadCreateResponse<Partial<ProductType> & Partial<PayloadErrorResponse>>> {
		return this.fetchPayload('/api/product-types', {
			method: 'post',
			body: JSON.stringify(productType),
			headers: getAuthHeaders()
		});
	}
}
