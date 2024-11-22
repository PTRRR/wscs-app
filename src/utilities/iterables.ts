export const filterDuplicate = <T = unknown>(item: T, index: number, self: T[]) =>
	self.indexOf(item) === index;

export const filterNullish = <T>(
	item: T | null | undefined,
	index: number,
	self: (T | null | undefined)[]
): item is NonNullable<T> => item !== null && item !== undefined;
