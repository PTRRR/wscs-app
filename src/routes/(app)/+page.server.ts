import { WSCS } from '../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);
	const res = await api.findProducts({
		limit: 60,
		query: {
			_status: { equals: 'published' }
		}
	});

	return {
		products: res.docs || []
	};
};
