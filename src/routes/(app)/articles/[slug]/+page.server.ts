import { error } from '@sveltejs/kit';
import { WSCS } from '../../../../utilities/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params }) => {
	const {
		api: { baseUrl }
	} = await parent();

	try {
		const { slug } = params;

		const api = new WSCS(baseUrl);
		const articlesResponse = await api.findArticles({
			query: {
				slug: {
					equals: slug
				}
			}
		});

		const article = articlesResponse.docs[0];

		if (article === undefined) {
			throw new Error('Article not found');
		}

		return {
			article
		};
	} catch (e) {
		console.log(e);
		return error(404, 'Article not found');
	}
};
