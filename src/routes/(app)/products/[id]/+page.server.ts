import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);

	try {
		const [product, variations] = await Promise.all([
			api.findProductById(params.id),
			api.findVariations({
				query: {
					product: {
						equals: params.id
					}
				}
			})
		]);

		return {
			product: { ...product, variations }
		};
	} catch (e) {
		console.log(e);
		return error(404, 'Product not found');
	}
};
