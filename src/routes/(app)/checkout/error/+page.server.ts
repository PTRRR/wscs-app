import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	let message = url.searchParams.get('message');
	return { message };
};
