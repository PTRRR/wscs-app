import qs from 'qs';

import type {
	Article,
	Attribute,
	Brand,
	Category,
	Entity,
	Filter,
	Media,
	Order,
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
	limit?: number;
	page?: number;
	depth?: number;
	sort?: string;
	query?: Record<string, { [key in QueryOperators]?: string | number | string[] | number[] }>;
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
	return qs.stringify(
		{
			where: params?.query,
			depth: params?.depth,
			limit: params?.limit,
			page: params?.page,
			sort: params?.sort
		},
		{ addQueryPrefix: true }
	);
};

export class WSCS {
	constructor(private readonly baseUrl?: string) {}

	private async fetchPayload<T>(url: string, init?: RequestInit, timeout = 10000): Promise<T> {
		const abortController = new AbortController();
		const fullPath = joinPaths(this.baseUrl || 'http://localhost:3000', url);

		const abortTimeout = setTimeout(() => {
			abortController.abort();
		}, timeout);

		const res = await fetch(fullPath, {
			credentials: 'include',
			...init,
			signal: abortController.signal,
			headers: {
				'Content-Type': 'application/json',
				...(init?.headers || {})
			}
		});

		const json = await res.json();
		clearTimeout(abortTimeout);

		if (res.status > 399 || json.error) {
			throw new Error(`${json.error || json.message || res.statusText}`);
		}

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
			method: 'POST',
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
			method: 'POST',
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
			method: 'POST',
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
			method: 'POST',
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
			method: 'POST',
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
			method: 'POST',
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
			method: 'POST',
			body: JSON.stringify(productType),
			headers: getAuthHeaders()
		});
	}

	login(params: { email: string; password: string }) {
		return this.fetchPayload<{ token: string; user: User }>('/api/users/login', {
			method: 'POST',
			body: JSON.stringify({
				email: params.email,
				password: params.password
			})
		});
	}

	logout() {
		return this.fetchPayload<User>('/api/users/logout', {
			method: 'POST'
		});
	}

	createUser(params: { email: string; password: string; passwordConfirg: string }) {
		return this.fetchPayload<{ message: string; doc: User }>('/api/users', {
			method: 'POST',
			body: JSON.stringify({
				email: params.email,
				password: params.password,
				passwordConfirg: params.passwordConfirg
			})
		});
	}

	me() {
		return this.fetchPayload<{ user?: User }>('/api/users/me');
	}

	createPayementIntent() {
		return this.fetchPayload<{ client_secret: string }>('/api/payment-intent', {
			method: 'POST'
		});
	}

	updateCart(params: { userId: User['id']; cart: User['cart']; depth?: number }) {
		const query = qs.stringify({ depth: params?.depth || 0 }, { addQueryPrefix: true });

		return this.fetchPayload<User>(`/api/users/${params.userId}${query}`, {
			method: 'PATCH',
			body: JSON.stringify({
				cart: params.cart
			})
		});
	}

	createOrder(order: Pick<Order, 'orderedBy' | 'items' | 'total' | 'stripePaymentIntentID'>) {
		return this.fetchPayload<Order>('/api/orders', {
			method: 'POST',
			body: JSON.stringify(order)
		});
	}

	findEntities(params?: PayloadFindParams): Promise<PayloadListResponse<Entity>> {
		return this.fetchPayload<PayloadListResponse<Entity>>(`/api/entities${getFindQuery(params)}`);
	}

	findEntityById(id: string | number): Promise<Entity> {
		return this.fetchPayload<Entity>(`/api/entities/${id}`);
	}

	findBrands(params?: PayloadFindParams): Promise<PayloadListResponse<Brand>> {
		return this.fetchPayload<PayloadListResponse<Brand>>(`/api/brands${getFindQuery(params)}`);
	}

	findArticles(params?: PayloadFindParams): Promise<PayloadListResponse<Article>> {
		return this.fetchPayload<PayloadListResponse<Article>>(`/api/articles${getFindQuery(params)}`);
	}

	findArticleById(id: string | number): Promise<Article> {
		return this.fetchPayload<Article>(`/api/articles/${id}`);
	}

	getGlobalFilters(): Promise<Filter> {
		return this.fetchPayload<Filter>(`/api/globals/filters`);
	}

	getSearchKey(): Promise<{ value?: string }> {
		return this.fetchPayload<{ value?: string }>(`/api/search-key`);
	}
}
