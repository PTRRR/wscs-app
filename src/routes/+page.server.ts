import { WSCS } from '../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const api = new WSCS();
	const res = await api.findProducts();

	return {
		products: res.docs
	};
};
