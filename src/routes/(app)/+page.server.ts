import { Client } from 'typesense';
import { WSCS } from '../../utilities/api';
import type { PageServerLoad } from './$types';
import { searchProductToProduct, type Hit, type SearchProduct } from '../../utilities/typesense';

export const load: PageServerLoad = async ({ parent }) => {
	const {
		api: { baseUrl },
		typesense
	} = await parent();

	const api = new WSCS(baseUrl);
	const client = new Client(typesense.clientConfig);

	const [productsResponse, articlesResponse, entitiesResponse, brandsResponse, filtersResponse] =
		await Promise.all([
			client.collections(typesense.productsCollection).documents().search({
				q: '*',
				limit: 50
			}) as Promise<{ hits: Hit<SearchProduct>[] }>,
			api.findArticles({
				sort: '-createdAt',
				limit: 1,
				query: {
					_status: { equals: 'published' }
				}
			}),
			api.findEntities({
				query: {
					_status: { equals: 'published' }
				}
			}),
			api.findBrands({
				sort: 'title'
			}),
			api.getGlobalFilters()
		]);

	return {
		products: productsResponse.hits.map((it) => searchProductToProduct(it.document)),
		article: (articlesResponse.docs || [])[0],
		entities: entitiesResponse.docs || [],
		brands: brandsResponse.docs || [],
		filters: filtersResponse.filters || []
	};
};
