import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
	const {
		api: { baseUrl }
	} = await parent();

	const { slug } = params;

	const api = new WSCS(baseUrl);
	const entities = await api.findEntities({
		query: {
			slug: {
				equals: slug
			}
		}
	});

	const entity = entities.docs[0];

	return {
		entity
	};
};
