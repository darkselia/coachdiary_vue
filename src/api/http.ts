export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;
export type RequestBody = Record<string | number, unknown> | unknown[] | FormData;

type ApiRequestOptions = {
  params?: QueryParams;
  body?: RequestBody;
  contentType?: string | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  readonly response: Response;

  constructor(response: Response, details: unknown) {
    super(getApiErrorMessage(details));
    this.name = 'ApiError';
    this.status = response.status;
    this.details = details;
    this.response = response;
  }
}

export const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

export function getCookie(name: string): string | null {
  const cookieArr = document.cookie.split(';');

  for (const cookie of cookieArr) {
    const cookiePair = cookie.split('=');

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

export function apiGet<T>(url: string, params?: QueryParams): Promise<T> {
  return apiRequest<T>(url, 'GET', { params });
}

export function apiPost<T>(
  url: string,
  body?: RequestBody,
  contentType?: string | null,
): Promise<T> {
  return apiRequest<T>(url, 'POST', { body, contentType });
}

export function apiPut<T>(url: string, body?: RequestBody): Promise<T> {
  return apiRequest<T>(url, 'PUT', { body });
}

export function apiPatch<T>(url: string, body?: RequestBody): Promise<T> {
  return apiRequest<T>(url, 'PATCH', { body });
}

export function apiDelete<T = void>(url: string): Promise<T> {
  return apiRequest<T>(url, 'DELETE');
}

export async function apiBlob(url: string, params?: QueryParams): Promise<Blob> {
  const response = await fetch(buildUrl(url, params), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError(response, await parseResponse(response));
  }

  return response.blob();
}

async function apiRequest<T>(
  url: string,
  method: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(url, options.params), {
    method,
    headers: buildHeaders(method, options.body, options.contentType),
    body: serializeBody(options.body),
    credentials: 'include',
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(response, data);
  }

  return data as T;
}

function buildUrl(url: string, params?: QueryParams): string {
  const urlObj = new URL(API_BASE + url);

  for (const key in params) {
    const value = params[key];
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item !== null && item !== undefined) {
        urlObj.searchParams.append(key, String(item));
      }
    }
  }

  return urlObj.toString();
}

function buildHeaders(
  method: string,
  body?: RequestBody,
  contentType: string | null = 'application/json',
): HeadersInit {
  const headers: Record<string, string> = {};

  if (!(body instanceof FormData) && contentType) {
    headers['Content-Type'] = contentType;
  }

  if (method !== 'GET') {
    headers['X-CSRFToken'] = getCookie('csrftoken') ?? '';
  }

  return headers;
}

function serializeBody(body?: RequestBody): BodyInit | undefined {
  if (body instanceof FormData) {
    return body;
  }

  return body ? JSON.stringify(body) : undefined;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function getApiErrorMessage(error: unknown): string {
  if (!isRecord(error)) {
    return typeof error === 'string' && error ? error : 'Неизвестная ошибка';
  }

  for (const key of ['details', 'errors', 'детали', 'Детали', 'error', 'new_password']) {
    if (key in error) {
      return Object.values(flattenObject(error[key])).join(' ');
    }
  }

  return 'Неизвестная ошибка';
}

function flattenObject(
  obj: unknown,
  parentKey = '',
  result: Record<string, unknown> = {},
): Record<string, unknown> {
  if (!isRecord(obj)) {
    result[parentKey || 'value'] = obj;
    return result;
  }

  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}[${key}]` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((item, index) => flattenObject(item, `${newKey}[${index}]`, result));
    } else if (isRecord(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
