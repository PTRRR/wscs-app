export const isNotNumber = <T>(value: T | number): value is T => typeof value !== 'number';

export const getApiObject = <T>(value: T | number): T | undefined => {
	return isNotNumber(value) ? value : undefined;
};
