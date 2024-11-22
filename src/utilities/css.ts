type CSSProperties = Partial<
	Omit<
		CSSStyleDeclaration,
		| 'item'
		| 'getPropertyPriority'
		| 'getPropertyValue'
		| 'removeProperty'
		| 'setProperty'
		| 'length'
		| 'parentRule'
	>
>;

const kebabCase = (str: string): string => {
	return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};

export const css = (
	properties: CSSProperties & { [key: string]: string | number | undefined }
): string => {
	return Object.entries(properties)
		.map(([key, value]) => {
			if (value === undefined) return '';
			const cssKey = kebabCase(key);
			// Add px to number values except for specific properties
			const cssValue = value;
			return `${cssKey}: ${cssValue};`;
		})
		.filter(Boolean)
		.join(' ');
};
