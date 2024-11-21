import { WSCS } from '../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);

	const [productsResponse, articlesResponse] = await Promise.all([
		api.findProducts({
			limit: 60,
			query: {
				_status: { equals: 'published' }
			}
		}),
		api.findArticles({
			sort: '-createdAt',
			limit: 1,
			query: {
				_status: { equals: 'published' }
			}
		})
	]);

	return {
		products: productsResponse.docs || [],
		article: (articlesResponse.docs || [])[0]
	};
};
