import {
  SyliusProduct,
  SyliusProductImage,
  SyliusProductOption,
  SyliusProductVariant
} from '../sylius-types/product-types';
import { Image, Product, ProductOption, ProductVariant } from '../types';
import { normalizePrice } from './utils-normalizer';
import {REST_METHODS, SYLIUS_API_ENDPOINT} from "../../constants";
import syliusRequest from "../index";

export const normalizeProduct = async (product: SyliusProduct): Promise<Product> => {
  product.variants = await Promise.all(product.variants.map(async (variant) : Promise<SyliusProductVariant> => {
    const data = await syliusRequest(REST_METHODS.GET, variant.replace(SYLIUS_API_ENDPOINT, ''));
    return data.body
  }))
  const variants  = await Promise.all(product.variants.map(async (variant: SyliusProductVariant) : Promise<ProductVariant> => {
    return await normalizeProductVariant(variant)
  }))

  return {
    seo: {
      title: product.name,
      description: product.shortDescription
    },
    // variants not needed for cart normalization
    variants: variants || [],
    images: product.images.map(normalizeProductImage),
    id: product.id.toString(),
    handle: product.slug,
    availableForSale: product.variants.some((variant) => variant.inStock),
    title: product.name,
    description: product.shortDescription,
    descriptionHtml: product.description,
    options: product.options.map(normalizeProductOption),
    priceRange: normalizePriceRange(product),
    featuredImage: normalizeProductImage(product.images[0] as SyliusProductImage),
    tags: [],
    updatedAt: product.updatedAt.toString()
  }
};

const normalizeProductVariant = async (variant: SyliusProductVariant): Promise<ProductVariant> => {
  const selectedOptions = await Promise.all(variant.optionValues.map(async (optionValue) => {
    let data = await syliusRequest(REST_METHODS.GET, optionValue.replace(SYLIUS_API_ENDPOINT, ''));
    const value = data.body;
    data = await syliusRequest(REST_METHODS.GET, value.option.replace(SYLIUS_API_ENDPOINT, ''));
    const option = data.body;
    return { name: option.name, value: value.value };
  }));

  return {
    id: variant.id.toString(),
    code: variant.code,
    title: variant.name,
    availableForSale: variant.inStock,
    selectedOptions: selectedOptions || [],
    price: normalizePrice(variant.price)
  };
};

const normalizeProductOption = (option: SyliusProductOption): ProductOption => ({
  id: option.id.toString(),
  name: option.name,
  values: option.values.map((optionValue) => optionValue.value)
});

export const normalizeProductImage = (image: SyliusProductImage): Image => ({
  url: image.path,
  altText: image.path,
  width: 400,
  height: 400
});

const normalizePriceRange = (product: SyliusProduct) => {
  let minVariantPrice = 0;
  let maxVariantPrice = 0;

  for (const variant of product.variants) {
    if (variant.price < minVariantPrice) {
      minVariantPrice = variant.price;
    }
    if (variant.price > maxVariantPrice) {
      maxVariantPrice = variant.price;
    }
  }

  return {
    minVariantPrice: normalizePrice(minVariantPrice),
    maxVariantPrice: normalizePrice(maxVariantPrice)
  };
};
