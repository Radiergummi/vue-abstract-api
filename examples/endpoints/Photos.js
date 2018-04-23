'use strict';

import Resource from '../../src/Resource';

/**
 * Example photos API endpoint. Refer to the static getters and setters below to find out more on how to
 * configure your endpoints. By the way: The `Resource` class inherits directly from `Endpoint`, so any
 * props and methods available there are also available here.
 */
class Photos extends Resource {

  /**
   * Retrieves the endpoint API path that will be attached to the base URL. If you omit this, the path
   * is automatically generated from the lower-cased class name.
   * This must be a string.
   */
  static get path () {
    return '/photos';
  }

  /**
   * Whether this endpoint is cachable. If this property is true, any GET response will be stored in a
   * cache `Map` (keyed by the final request URL). On subsequent requests, instead of performing another
   * HTTP request, the cached Response object is returned, resulting in immediate responses.
   * You can still skip the cache lookup by passing the `cache: false` option on requests, however.
   * Be aware of the implications, though: The cache has no automatic TTL, so you need to flush the cache
   * manually using the `flushCache()` method, if necessary.
   * TODO: Ideally, all the writing methods should intelligently figure out the consequences of their
   * actions, flushing the entire cache or just partials after execution.
   */
  static get cachable () {
    return true;
  }

  /**
   * Retrieves the parameter names. Now this one is almost a must for your endpoints: It allows
   * you to set "alias" names for common parameters vue-abstract-api provides special modifiers for.
   * That is, you can chain `.paginate()` before your method call, resulting in the appropriate
   * parameters being attached to your requests. To make this work, we need to know which parameters to
   * use, so using this getter, you can define your own. The list of available aliases and their defaults
   * is as follows:
   *
   *    alias name            | default value  | comment
   *  - limit                   limit            used to set the number of items per page in paginated mode
   *  - offset                  offset           used to set the offset from the previous request
   *  - orderDirection          direction        used to set the direction the results should be ordered in
   *  - orderColumn             order_column     used to set the column the results should be ordered by
   *  - multipleOrderColumns    order_columns    used to set multiple ordering columns
   *  - filterColumns           filter_columns   used to set multiple filtering columns
   *
   * Now anywhere in your app you use "limit", it will result in the correct parameter being attached to
   * the request URL, no matter what endpoint you're using it on.
   *
   * To disable some parameters (for example because their value should be directly appended to the URL),
   * set them to `null`.
   *
   * Read on regarding filters and ordering.
   */
  static get parameterNames () {
    return {
      limit:                '_limit',
      offset:               '_start',
      orderDirection:       '_order',
      orderColumn:          '_sort',
      multipleOrderColumns: 'order_columns',
      filterColumns:        null
    };
  }

  /**
   * Retrieves the default parameters for each request. This must return an object containing any of the
   * request options available; it is up to you to figure out which ones. By default, this will add
   * pagination limited to 10 results, sorting is set to ascending.
   * Default parameters are a powerful tool - they allow you to configure different settings for your
   * application views, while sticking with the globally valid parameter names.
   */
  static get defaultParameters () {
    return {
      paginate:             true,
      limit:                10,
      offset:               0,
      orderDirection:       'ASC',
      multipleOrderColumns: false
    };
  }

  /**
   * Retrieves a mapper function to figure out results and meta data. By default, we assume the API just
   * returns all matched entities as an array, without any additional meta data.
   * You can, however, set additional meta data fields here, the most popular being "count" and "total".
   * Count reflects the number of retrieved items (usually the length of the response data, but there
   * are additional concerns where using an API-provided value might be better), Total is the total number
   * of available, matching entities on the server. This is most useful for paginated results.
   * Beyond these, there might be more fields you want to populate. The `Response` object will provide
   * getters for any of them, so what you want to do here is populate the fields with values from the
   * response data.
   * Since we receive the actual `AxiosResponse` object here, we also have access to headers and so on.
   *
   * The only mandatory key in the return object is "results". Count will be set to the results length,
   * total to "-1" if missing.
   */
  static get mapResults () {
    return response => {
      const results = Array.from( response.data );

      return {
        results: results,
        count:   results.length,
        total:   response.headers[ 'X-Total-Count' ]
      };
    };
  }

  /**
   * Retrieves a mapper function to assemble the filter parameter value. This might sound a little
   * complicated first, but bear with me: if you decide to filter your results, a parameter named
   * "filter_columns" (or whatever you set in defaultParameterNames for filterColumns) will be
   * appended to your request URL. The value of this property might require a special format to be
   * understood by your API, so this callback gives you a possibility to create the string on your
   * own. What you will receive is an object structured as `{ "my-FieldName": "filter value"}`,
   * so the below approach to map the entries might work best.
   * Whatever the output you require, just return a string in the end.
   *
   * By default, the output looks like so: 'my-FieldName:filter value,my-other_field:123,foo:true'
   */
  static get mapFilters () {
    return filters => Object
      .entries( filters )
      .map( ( [ field, value ] ) => `${field}:${value}` )
      .join( ',' );
  }

  /**
   * Retrieves a mapper function to assemble the order parameter value, should you use multiple field
   * ordering. The same things said for "mapFilters" apply here, too: Multi-ordering might be complex
   * in your application, so you can use this to create a custom field value.
   */
  static get mapOrders () {
    return orders => Object
      .entries( orders )
      .map( ( [ field, direction ] ) => `${field}:${direction}` )
      .join( ',' );
  }
}

export default Photos;
