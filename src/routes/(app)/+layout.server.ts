import { WSCS } from '../../utilities/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const api = new WSCS(baseUrl);

	const entitiesResponse = await api.findEntities({
		query: {
			_status: { equals: 'published' }
		}
	});

	return {
		entities: entitiesResponse.docs
	};
};
