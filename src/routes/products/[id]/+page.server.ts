import { findProductById, findProducts } from '../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const res = await findProductById(params.id);

	return {
		product: res
	};
};
