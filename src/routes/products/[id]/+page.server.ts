import { WSCS } from '../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const api = new WSCS();
	const res = await api.findProductById(params.id);

	return {
		product: res
	};
};
