export const filterDuplicate = <T = unknown>(item: T, index: number, self: T[]) =>
	self.indexOf(item) === index;
