import { WSCS } from '../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);
	const res = await api.findProducts();

	return {
		products: res.docs
	};
};
