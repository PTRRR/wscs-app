import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);
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
};
