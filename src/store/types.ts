export type Cart = {
	items: CartItem[];
};

export type CartItem = {
	product: number;
	variation: number;
	quantity: number;
};
