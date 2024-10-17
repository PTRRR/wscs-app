export type PartialBy<T extends Record<string, unknown>, K extends keyof T> = Partial<Pick<T, K>> &
	Omit<T, K>;
