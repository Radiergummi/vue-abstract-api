'use strict';

//
// Example configuration using jsonplaceholder.typicode.com
//

import EventBus from './EventBus';
import Photos   from './endpoints/Photos';
import Posts    from './endpoints/Posts';

/**
 * Provides configuration for the API abstraction layer
 */
export default {

  /**
   * Base API remote URL. In development, this can be substituted with a local version or mocked in tests.
   * All Endpoints loaded in the application will use this base URL as their base URL (duh) and append their
   * respective path suffixes to it.
   *
   * @type {String}
   */
  baseUrl: 'https://jsonplaceholder.typicode.com',

  /**
   * Holds all registered API endpoints the application knows about. Endpoints provide a convenient way for
   * interacting with remote data, but you're not limited to using them, of course. Apart from creating new
   * Endpoints as necessary, you can also use the `http` property of the API class to perform AJAX requests.
   *
   * All endpoints passed here will be created and attached to the Vue plugin with their lower-cased name.
   *
   * @type {Array<Endpoint>}
   */
  endpoints: [
    Posts,
    Photos
  ],

  interceptors: {
    request: [
      config => {
        if ( config.method === 'get' ) {
          EventBus.$emit( 'status-update', {
            status: 'downloading'
          } );
        } else {
          EventBus.$emit( 'status-update', {
            status: 'uploading'
          } );
        }

        return config;
      }
    ],

    response: [
      response => {
        EventBus.$emit( 'status-update', {
          status: 'success'
        } );

        return response;
      }
    ]
  }
};

