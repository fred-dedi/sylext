import { SYLIUS_API_ENDPOINT } from 'lib/constants';
import {getCollections} from "./catalog/taxons";

const DOMAIN = `${process.env.NEXT_PUBLIC_SYLIUS_BACKEND_API}`;
const ENDPOINT = `${DOMAIN}${SYLIUS_API_ENDPOINT}`;

// Fetch
export default async function syliusRequest(
  method: string,
  path = '',
  payload?: Record<string, unknown> | undefined,
  contentType?: string
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': contentType ?? 'application/json',
      Accept: 'application/json'
    }
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    const result = await fetch(`${ENDPOINT}${path}`, options);

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    throw {
      error: e
    };
  }
}

// Pages
export const getPages = () => [];
export const getPage = (page: string) => {
  return {
    title: 'Page',
    body: 'This is a page',
    bodySummary: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    seo: {
      title: '',
      description: '',
    }
  }
};
// Site
export const getMenu = async () => {
  const collections = await getCollections();
  return [
    ...collections.map(({ title, path }) => ({ title, path }))
  ];
};
