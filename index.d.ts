/// <reference types="vue-abstract-api" />

import {AxiosInstance, AxiosResponse} from 'axios';

interface HeaderLineObject {
  [key: string]: String;
}

interface AuthenticationObject {
  user: String;
  password: String;
}

interface ApiOptions {
  headers: HeaderLineObject,
  authentication: AuthenticationObject;
  interceptors: {
    request: Array<(value: any) => any | Promise<any>>,
    response: Array<(value: any) => any | Promise<any>>
  }
}

export interface Api {
  new(baseUrl: String, options: ApiOptions): Api;

  baseUrl: String;
  headers: HeaderLineObject;
  authentication: AuthenticationObject;
  http: AxiosInstance;
  endpoints: Set<Endpoint>;
}

export interface Endpoint {
  api: Api;
  name: String;
  cache?: Map;

  mount(api: Api): void;

  flushCache(path?: String): void;

  get(path: String, ...args): Promise<ApiResponse>;

  delete(path: String, ...args): Promise<any>;

  post(path: String, data: Object, ...args): Promise<any>;

  put(path: String, data: Object, ...args): Promise<any>;

  patch(path: String, data: Object, ...args): Promise<any>;
}

interface RequestOptionsObject {
  params: Object
}

export interface Resource extends Endpoint {
  path: String;

  index(options?: RequestOptionsObject): Promise<ApiResponse>;

  all(options?: RequestOptionsObject): Promise<Array<any>>;

  one(id: Number, options?: RequestOptionsObject): Promise<any>;

  create(data: Object, options?: RequestOptionsObject): Promise<any>;

  update(id: Number, data: Object, options?: RequestOptionsObject): Promise<any>;

  destroy(id: Number, options?: RequestOptionsObject): Promise<any>;

  paginate(limit?: Number, offset?: Number): this;

  orderBy(field: String, direction?: 'ASC' | 'DESC'): this;

  filterBy(field: String, value: any): this;
}

interface ResponseDataObject<T = any> extends AxiosResponse {
  total: Number;
  count: Number;
  results: Array<T>;
}

export interface ApiResponse<T = any> {
  new(axiosResponse: AxiosResponse): ApiResponse;

  data: ResponseDataObject;
  total: Number;
  count: Number;
  results: Array<T>;
  first: T;
  last: T;
  statusCode: Number;
  headers: HeaderLineObject;
  request: XMLHttpRequest;
  response: AxiosResponse;
}
