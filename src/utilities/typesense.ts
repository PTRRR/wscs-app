export type TypesenseConfig = {
	apiKey: string;
	nodes: {
		host: string;
		port: number;
		protocol: string;
	}[];
};
