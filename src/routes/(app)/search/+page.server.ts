import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	let q = url.searchParams.get('q');
	return { q };
};
