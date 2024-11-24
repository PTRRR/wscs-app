export const isNotNumber = <T>(value: T | number): value is T => typeof value !== 'number';

export const getApiObject = <T>(value: T | number): T | undefined => {
	return isNotNumber(value) ? value : undefined;
};

export const getApiObjectId = <T extends { id?: number | null } | number | null | undefined>(
	value: T
): number | undefined => {
	return typeof value === 'number' ? value : value?.id || undefined;
};
