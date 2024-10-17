import { findProducts } from '../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const res = await findProducts();

	return {
		products: res.docs
	};
};
