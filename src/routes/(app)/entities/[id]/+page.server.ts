import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const { id } = params;

	const api = new WSCS(baseUrl);
	const entity = await api.findEntityById(id);

	return {
		entity
	};
};
