import qs from 'qs';

import type {
	Attribute,
	Category,
	Media,
	Product,
	ProductType,
	Tag,
	User,
	Variation
} from './types';
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

export interface PayloadFindParams {
	depth?: number;
	query?: Record<string, { [key in QueryOperators]?: string }>;
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

const getFindQuery = (params?: PayloadFindParams) => {
	return qs.stringify({ where: params?.query, depth: params?.depth }, { addQueryPrefix: true });
};

export class WSCS {
	constructor(
		private readonly baseUrl?: string,
		private readonly token?: string
	) {}

	private async fetchPayload<T>(url: string, init?: RequestInit): Promise<T> {
		const fullPath = joinPaths(this.baseUrl || 'http://localhost:3000', url);
		const res = await fetch(fullPath, {
			credentials: 'include',
			headers: this.token
				? {
						Autorization: `Bearer ${this.token}`,
						...(init?.headers || {})
					}
				: init?.headers,
			...init
		});
		const json = await res.json();
		return json as T;
	}

	findProductById(id: string | number): Promise<Product> {
		return this.fetchPayload<Product>(`/api/products/${id}`);
	}

	findProducts(params?: PayloadFindParams): Promise<PayloadListResponse<Product>> {
		return this.fetchPayload<PayloadListResponse<Product>>(`/api/products${getFindQuery(params)}`);
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

	findVariations(params?: PayloadFindParams): Promise<PayloadListResponse<Variation>> {
		return this.fetchPayload<PayloadListResponse<Variation>>(
			`/api/variations${getFindQuery(params)}`
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

	findAttribute(params?: PayloadFindParams): Promise<PayloadListResponse<Attribute>> {
		return this.fetchPayload<PayloadListResponse<Attribute>>(
			`/api/attributes${getFindQuery(params)}`
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

	findMedias(params?: PayloadFindParams): Promise<PayloadListResponse<Media>> {
		return this.fetchPayload<PayloadListResponse<Media>>(`/api/media${getFindQuery(params)}`);
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

	findCategories(params?: PayloadFindParams): Promise<PayloadListResponse<Category>> {
		return this.fetchPayload<PayloadListResponse<Category>>(
			`/api/categories${getFindQuery(params)}`
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

	findTags(params?: PayloadFindParams): Promise<PayloadListResponse<Tag>> {
		return this.fetchPayload<PayloadListResponse<Tag>>(`/api/tags${getFindQuery(params)}`);
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

	findProductTypes(params?: PayloadFindParams): Promise<PayloadListResponse<ProductType>> {
		return this.fetchPayload<PayloadListResponse<ProductType>>(
			`/api/product-types${getFindQuery(params)}`
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

	login(params: { email: string; password: string }) {
		return this.fetchPayload<User>('/api/users/login', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: params.email,
				password: params.password
			})
		});
	}

	logout() {
		return this.fetchPayload<User>('/api/users/logout', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	me() {
		return this.fetchPayload<{ user?: User }>('/api/users/me');
	}
}
