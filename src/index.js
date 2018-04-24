'use strict';

import Api         from './Api';
import ApiResponse from './ApiResponse';

import Endpoint from './Endpoint';
import Resource from './Resource';

export { Endpoint, Resource, ApiResponse };

export default {
  install ( Vue, options = {} ) {

    // check for the headers option, default it
    if ( !options.hasOwnProperty( 'headers' ) ) {
      options.headers = {};
    }

    // check for the interceptors option, default it
    if ( !options.hasOwnProperty( 'interceptors' ) ) {
      options.interceptors = {
        request:  [],
        response: []
      };
    } else {
      if ( !options.interceptors.hasOwnProperty( 'request' ) ) {
        options.interceptors.request = [];
      }

      if ( !options.interceptors.hasOwnProperty( 'response' ) ) {
        options.interceptors.response = [];
      }
    }

    if ( !options.hasOwnProperty( 'endpoints' ) ) {
      options.endpoints = [];
    }

    /**
     * Attaches the API to the Vue prototype
     *
     * @type {Api}
     */
    Vue.prototype.$api = new Api( options.baseUrl, options );

    for ( let EndpointClass of options.endpoints ) {
      Vue.prototype.$api.mount( new EndpointClass() );
    }

    /**
     * Attaches the HTTP adapter to the Vue prototype to perform custom requests
     *
     * @type {AxiosInstance}
     */
    Vue.prototype.$http = Vue.prototype.$api.http;
  }
};
