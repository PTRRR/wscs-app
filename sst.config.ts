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
			},
			transform: {
				cdn: (args) => {
					if (Array.isArray(args.origins)) {
						args.origins.push({
							originId: 'payload-origin',
							domainName: 'cm20hjsx1000008jre1ya33xb.vpr-group.ch',
							customOriginConfig: {
								httpPort: 80,
								originProtocolPolicy: 'http-only',
								httpsPort: 443,
								originSslProtocols: ['TLSv1.2']
							}
						});
					}

					if (Array.isArray(args.orderedCacheBehaviors)) {
						args.orderedCacheBehaviors.push({
							pathPattern: 'admin*',
							targetOriginId: 'payload-origin',
							viewerProtocolPolicy: 'redirect-to-https',
							allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
							cachedMethods: ['GET', 'HEAD'],
							compress: true,
							defaultTtl: 0,
							minTtl: 0,
							maxTtl: 0,
							forwardedValues: {
								cookies: { forward: 'all' },
								headers: ['*'],
								queryString: true
							}
						});

						args.orderedCacheBehaviors.push({
							pathPattern: '_next*',
							targetOriginId: 'payload-origin',
							viewerProtocolPolicy: 'redirect-to-https',
							allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
							cachedMethods: ['GET', 'HEAD'],
							compress: true,
							defaultTtl: 0,
							minTtl: 0,
							maxTtl: 0,
							forwardedValues: {
								cookies: { forward: 'all' },
								headers: ['*'],
								queryString: true
							}
						});

						args.orderedCacheBehaviors.push({
							pathPattern: 'api/media/file*',
							targetOriginId: 'payload-origin',
							viewerProtocolPolicy: 'redirect-to-https',
							allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
							cachedMethods: ['GET', 'HEAD'],
							compress: true,
							cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // Got this value form existing behaviours
							functionAssociations: []
						});

						args.orderedCacheBehaviors.push({
							pathPattern: 'api*',
							targetOriginId: 'payload-origin',
							viewerProtocolPolicy: 'redirect-to-https',
							allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
							cachedMethods: ['GET', 'HEAD'],
							compress: true,
							defaultTtl: 0,
							minTtl: 0,
							maxTtl: 0,
							forwardedValues: {
								cookies: { forward: 'all' },
								headers: ['*'],
								queryString: true
							}
						});
					}
				}
			}
		});
	}
});
