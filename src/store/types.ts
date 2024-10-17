export type CartItem = {
	productId: string | number;
	variationId: string | number;
	quantity: number;
	price: number;
};

export type Cart = {
	items: CartItem[];
};
