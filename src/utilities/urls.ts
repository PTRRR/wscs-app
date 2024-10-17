export const joinPaths = (...paths: string[]): string => {
	if (paths.length === 0) return '';

	let joinedPath = paths[0];

	for (let i = 1; i < paths.length; i++) {
		// Ensure no extra slashes between segments except after protocol (http:// or https://)
		if (joinedPath.match(/https?:\/\//) && paths[i].startsWith('/')) {
			joinedPath = joinedPath.replace(/\/+$/, '') + paths[i]; // preserve single slash after protocol
		} else {
			joinedPath = joinedPath.replace(/\/+$/, '') + '/' + paths[i].replace(/^\/+/, '');
		}
	}

	// Normalize the result path
	return joinedPath;
};
