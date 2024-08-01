import {GetCollectionProductsPayload, GetProductsPayload} from "../types";
import { REST_METHODS, SYLIUS_API_ENDPOINT } from 'lib/constants';
import {SyliusProduct, SyliusTaxon} from "../sylius-types/product-types";
import {normalizeProduct} from "../normalizer/product-normalizer";
import {normalizeCollection} from "../normalizer/collection-normalizer";
import syliusRequest from "../index";

const DOMAIN = `${process.env.NEXT_PUBLIC_SYLIUS_BACKEND_API}`;
const ENDPOINT = `${DOMAIN}${SYLIUS_API_ENDPOINT}`;

export const getProducts = async (payload: GetProductsPayload) => {
    const url = new URL(`${ENDPOINT}/products`);
    if (payload.query) {
        url.searchParams.set('translations.name', payload.query);
    }
    const orderBy = payload.reverse ? 'desc' : 'asc';

    if (payload.sortKey) {
        switch (payload.sortKey) {
            case 'RELEVANCE':
                break;
            case 'BEST_SELLING':
                break;
            case 'CREATED_AT':
                url.searchParams.set('order[createdAt]', orderBy);
                break;
            case 'PRICE':
                url.searchParams.set('order[price]', orderBy);
                break;
            default:
                break;
        }
    }

    const data = await syliusRequest(REST_METHODS.GET, '/products' + url.search);
    const syliusProducts = data.body;
    const products = await Promise.all(syliusProducts.map(async (syliusProduct: SyliusProduct) => {
        return await normalizeProduct(syliusProduct)
    }));
    return products;
};

export const getProduct = async (slug: string) => {
    const data = await syliusRequest(REST_METHODS.GET, '/products-by-slug/' + slug);

    const syliusProduct = data.body;
    return await normalizeProduct(syliusProduct)
};
export const getProductRecommendations = (id: string) => {
    return [];
};

export const getCollectionProducts = async (payload: GetCollectionProductsPayload) => {
    const url = new URL(`${ENDPOINT}/products`);
    if (payload.collection) {
        url.searchParams.set('productTaxons.taxon.code', payload.collection);
    }
    const orderBy = payload.reverse ? 'desc' : 'asc';

    if (payload.sortKey) {
        switch (payload.sortKey) {
            case 'RELEVANCE':
                break;
            case 'BEST_SELLING':
                break;
            case 'CREATED_AT':
                url.searchParams.set('order[createdAt]', orderBy);
                break;
            case 'PRICE':
                url.searchParams.set('order[price]', orderBy);
                break;
            default:
                break;
        }
    }

    const data = await syliusRequest(REST_METHODS.GET, '/products' + url.search);
    const syliusProducts = data.body || [];
    const products = await Promise.all(syliusProducts.map(async (syliusProduct: SyliusProduct) => {
        return await normalizeProduct(syliusProduct)
    }));
    return products;
};