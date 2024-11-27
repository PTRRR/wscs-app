import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);

	try {
		const [products] = await Promise.all([
			api.findProducts({
				query: {
					slug: {
						equals: params.slug
					}
				}
			})
		]);

		const product = products.docs[0];

		return {
			product
		};
	} catch (e) {
		console.log(e);
		return error(404, 'Product not found');
	}
};
