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

	const [
		productsResponse,
		entitiesResponse,
		brandsResponse,
		filtersResponse,
		featuredArticlesResponse
	] = await Promise.all([
		client.collections(typesense.productsCollection).documents().search({
			q: '*',
			limit: 20
		}) as Promise<{ hits: Hit<SearchProduct>[] }>,
		api.findEntities({
			query: {
				_status: { equals: 'published' }
			}
		}),
		api.findBrands({
			sort: 'title',
			limit: 60
		}),
		api.getGlobalFilters(),
		api.getGlobalFeaturedArticles()
	]);

	return {
		products: productsResponse.hits.map((it) => searchProductToProduct(it.document)),
		entities: entitiesResponse.docs || [],
		brands: brandsResponse.docs || [],
		filters: filtersResponse.filters || [],
		additionalFilters: filtersResponse.additionalFilters || [],
		featuredArticles: featuredArticlesResponse.rows || []
	};
};
