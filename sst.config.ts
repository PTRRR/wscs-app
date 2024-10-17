// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'wscs-app',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'aws'
		};
	},
	async run() {
		new sst.aws.SvelteKit('WSCS', {
			domain: {
				name: 'wscs.vpr-group.ch',
				dns: false,
				cert: process.env.AWS_CERTIFICATE_ARN
			},
			environment: {
				BASE_API_URL: process.env.BASE_API_URL as string,
				TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY as string,
				TYPESENSE_HOST: process.env.TYPESENSE_HOST as string,
				TYPESENSE_PORT: process.env.TYPESENSE_PORT as string,
				TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL as string,
				TYPESENSE_PRODUCTS_COLLECTION: process.env.TYPESENSE_PRODUCTS_COLLECTIO as string
			}
		});
	}
});
