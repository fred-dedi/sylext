import {Collection} from "../types";
import syliusRequest from "../index";
import {REST_METHODS} from "../../constants";
import {SyliusTaxon} from "../sylius-types/product-types";
import {normalizeCollection} from "../normalizer/collection-normalizer";

export const getCollections = async (): Promise<Collection[]> => {
    const data = await syliusRequest(REST_METHODS.GET, '/taxons');

    const syliusTaxons = data.body;
    const collections = syliusTaxons.map((syliusTaxon: SyliusTaxon) =>
        normalizeCollection(syliusTaxon)
    );

    return collections;
};

export const getCollection = async (taxonCode: string) => {
    const data = await syliusRequest(REST_METHODS.GET, '/taxons/' + taxonCode);

    const syliusTaxon = data.body;
    const collection = normalizeCollection(syliusTaxon);

    return collection;
};
