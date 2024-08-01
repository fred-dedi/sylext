import {AddToCartPayload, Cart, UpdateCartPayload} from "../types";
import {REST_METHODS} from "../../constants";
import {normalizeCart} from "../normalizer/cart-normalizer";
import syliusRequest from "../index";

export const createCart = async (): Promise<Cart> => {
    const data = await syliusRequest(REST_METHODS.POST, '/orders', { localeCode: 'fr_FR' });
    const syliusCart = data.body;

    return await normalizeCart(syliusCart);
};
export const getCart = async (cartId: string): Promise<Cart> => {
    const data = await syliusRequest(REST_METHODS.GET, `/orders/${cartId}`);
    const syliusCart = data.body;
    return await normalizeCart(syliusCart);
};
export const addToCart = async (cartId: string | undefined, payload: AddToCartPayload[]) => {
    await syliusRequest(REST_METHODS.POST, `/orders/${cartId}/items`, {
        productVariant: payload[0]?.merchandiseId,
        quantity: payload[0]?.quantity
    });
};
export const removeFromCart = async (cartId: string, itemIds: string[]) => {
    await syliusRequest(REST_METHODS.DELETE, `/orders/${cartId}/items/${itemIds[0]}`);
};

export const updateCart = async (cartId: string, payload: UpdateCartPayload[]) => {
    await syliusRequest(
        REST_METHODS.PATCH,
        `/orders/${cartId}/items/${payload[0]?.id}`,
        {
            quantity: payload[0]?.quantity
        },
        'application/merge-patch+json'
    );
};
