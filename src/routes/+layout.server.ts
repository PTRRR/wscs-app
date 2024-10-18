import {
	BASE_API_URL,
	TYPESENSE_API_KEY,
	TYPESENSE_HOST,
	TYPESENSE_PORT,
	TYPESENSE_PROTOCOL,
	TYPESENSE_PRODUCTS_COLLECTION
} from '$env/static/private';
import { PUBLIC_STRIPE_KEY } from '$env/static/public';
import type { LayoutServerLoad } from './$types';
import { Client } from 'typesense';

export const load: LayoutServerLoad = async ({ setHeaders, cookies }) => {
	setHeaders({
		'Cache-Control': 'public, max-age=5, stale-while-revalidate=31536000'
	});

	const client = new Client({
		apiKey: TYPESENSE_API_KEY,
		nodes: [
			{
				host: TYPESENSE_HOST,
				port: parseInt(TYPESENSE_PORT),
				protocol: TYPESENSE_PROTOCOL
			}
		]
	});

	const key = await client.keys().create({
		description: 'Search-only key',
		actions: ['documents:search'],
		collections: [TYPESENSE_PRODUCTS_COLLECTION]
	});

	return {
		stripe: {
			publicKey: PUBLIC_STRIPE_KEY
		},
		api: {
			baseUrl: BASE_API_URL
		},
		typesense: {
			key,
			host: TYPESENSE_HOST,
			port: parseInt(TYPESENSE_PORT),
			protocol: TYPESENSE_PROTOCOL,
			productsCollection: TYPESENSE_PRODUCTS_COLLECTION
		}
	};
};
