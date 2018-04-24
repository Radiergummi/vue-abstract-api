# vue-abstract-api
> This is a lean API connector for Vue.js (though there is no dependency on it: You can use this in any framework you'd like to).


## Features
 - Abstraction of endpoints and resources into extendable classes
 - Flexible configuration using class properties
 - Well documented, readable code
 - Adapts to almost any API structure
 - Lightweight layer on top of [axios](https://github.com/axios/axios)

**You can try it here: [radiergummi.github.io/vue-abstract-api](https://radiergummi.github.io/vue-abstract-api/)**

## Installation
To install the plugin, just `npm install` it.

```bash
npm install vue-abstract-api
```

For development/to preview the example app (not complete yet, but working):
```bash
cd vue-abstract-api
npm install

npm run build // to build the library
npm run example:start // to start the example app on port 8080
npm run example:build // to build the example app
```

## Usage
To use vue-abstract-api, you'll first need to set up your configuration. Please refer to [the configuration section](#configuration) before proceeding; for now, we'll the following example configuration:

```js
import Cats from './Cats';
import Dogs from './Dogs';

export default {
    baseUrl:   'https://api.example.tld/v1',
    endpoints: [ Cats, Dogs ]
}
```


Lastly, insert the following *before* constructing your app:

```js
import Vue from 'vue';
import VueAbstractApi from 'vue-abstract-api';

// import your configuration here
import myApiConfig from './apiConfig';

// install the plugin
Vue.use( VueAbstractApi, myApiConfig );
```

That's it, you're ready to use the following in your components:
```js
// ...

    const twentyBlackCats = await this.$api.cats
        .paginate(20)
        .filterBy('color_fur_eq', 'black')
        .filterBy('color_eyes_eq', 'orange')
        .index();

    // twentyBlackCats.results === [ { cat } , ... ]
    // twentyBlackCats.total === 5124
    // twentyBlackCats.count === 20
    // twentyBlackCats.first === { cat }
    // twentyBlackCats.last === { cat }

    this.$api.cats.update(twentyBlackCats.first.id, {
        adopted: true,
        reason:  'SHE IS SO BEAUTIFUL 😍'
    });
```

To find out on how to wire things together, read on.


## Configuration
There are two means of configuration:

### 1. The API configuration (file)
The API configuration is a plain object with two required parameters: The `baseURL` which holds the common shared URL for all of your endpoints, and `endpoints`, an Array holding all of said endpoints.
What you want to do here is put in all of your endpoint classes (no instances) just as you imported them so the plugin knows about them. In the background, the endpoints will be *mounted* on the `Api` instance, providing them with access to the HTTP driver and more.

Additional available, optional options:

#### `headers`
Key-value map of headers to append to every request.

#### `authentication`
Object with the properties `username` and `password`. They will be directly passed to axios, therefore transformed into an `Authorization: Basic ${username}:${password}` header. See [here](https://github.com/axios/axios#request-config).

#### `interceptors`
Object with the properties `request` and `response`. Both can contain the respective interceptors and will be directly passed down to axios. See [here](https://github.com/axios/axios#interceptors).
Interceptors must be passed as objects like this:

```js
interceptors: {

    // request interceptors
    request: [

        // a single interceptor
        {
            // required, we need at least the success interceptor
            success: request => {
                // handle the request, return it back
                return request;
            },

            // optional, passing a success handler is enough
            error: response => {}
        }
    ],

    // response interceptors - see above
    response: []
}
```

What's **not** included right now is to change the content-type to anything but JSON. That will likely change soon, though.

You can either put that configuration object in a separate file for readability, or just throw all the imports in your `main.js`.

### 2. The endpoint classes
Endpoints, in this plugins terms, are classes that represent an endpoint on the remote API. Since they extend the provided classes and each configuration option has a sensible default, ideally, your full endpoint file looks like this:

```js
import Resource from '@vue-abstract-api/Resource';

class Point extends Resource {
}

export default Point;
```

There are two base classes available; configuration is the same no matter which one you use.

#### `Endpoint`
This class provides access to the HTTP methods and should be used for non-REST, RPC or otherwise irregular API endpoints. Just define a method named like the action you are going to carry out, wire up the right API call (using `this.get('/foo')`, for example), and you're good to go.

#### `Resource` *(Inherits from Endpoint)*
This class provides several pre-defined methods for working with data collection endpoints, aka resources. These methods include `index`, `all`, `one`, `create`, `update` and `destroy`. You'll probably use these most of the time when working with CRUD resources.

All configuration happens via static property getters. This has several advantages:
 - Properties are shared across all endpoint instances
 - They can be overridden from anywhere in the chain, including instances
 - Their types are documented and available via TypeScript definitions (included)

Additionally, any methods accept an options object as their last parameter that will get passed down to axios.

#### Configuration options
The following list shows all available getters. To view an example of a fully configured endpoint, take a look at [`examples/endpoints/Photos`](./examples/endpoints/Photos.js).

##### `path`
Retrieves the endpoint API path that will be attached to the base URL. If you omit this, the path is automaticallygenerated from the lower-cased class name.  
This must be a string.

```js
static get path () {
  return '/photos';
}
```

##### `cachable`
Whether this endpoint is cachable. If this property is true, any GET response will be stored in a cache `Map` (keyed by the final request URL). On subsequent requests, instead of performing another HTTP request, the cached Response object is returned, resulting in immediate responses.  
You can still skip the cache lookup by passing the `cache: false` option on requests, however.  
Be aware of the implications, though: The cache has no automatic TTL, so you need to flush the cache manually using the `flushCache()` method, if necessary.  
TODO: Ideally, all the writing methods should intelligently figure out the consequences of their actions, flushing the entire cache or just partials after execution.

Responses that have been served from cache have the property `fromCache` set to true.

```js
static get cachable () {
  return true;
}
```

##### `parameterNames`
Retrieves the parameter names. Now this one is almost a must for your endpoints: It allows you to set "alias" names for common parameters vue-abstract-api provides special modifiers for.  
That is, you can chain `.paginate()` before your method call, resulting in the appropriate parameters being attached to your requests. To make this work, we need to know which parameters to use, so using this getter, you can define your own.  
The list of available aliases and their defaults is as follows:

| alias name           | default value  | comment                                                    |
|:---------------------|:---------------|:-----------------------------------------------------------|
| limit                | limit          | used to set the number of items per page in paginated mode |
| offset               | offset         | used to set the offset from the previous request           |
| orderDirection       | direction      | used to set the direction the results should be ordered in |
| orderColumn          | order_column   | used to set the column the results should be ordered by    |
| multipleOrderColumns | order_columns  | used to set multiple ordering columns                      |
| filterColumns        | filter_columns |  used to set multiple filtering columns                    |

Now anywhere in your app you use "limit", it will result in the correct parameter being attached to the request URL, no matter what endpoint you're using it on.

To disable some parameters (for example because their value should be directly appended to the URL),  set them to `null`.
Read on regarding filters and ordering.

```js
  static get parameterNames () {
    return {
      limit:                'limit',
      offset:               'offset',
      orderDirection:       'direction',
      orderColumn:          'order_column',
      multipleOrderColumns: 'order_columns',
      filterColumns:        null
    };
  }
```

##### `defaultParameters`
Retrieves the default parameters for each request. This must return an object containing any of the request options available; it is up to you to figure out which ones. By default, this will add pagination limited to 10 results, sorting is set to ascending.  
Default parameters are a powerful tool - they allow you to configure different settings for your application views, while sticking with the globally valid parameter names.

```js
static get defaultParameters () {
  return {
    paginate:             true,
    limit:                10,
    offset:               0,
    orderDirection:       'ASC',
    multipleOrderColumns: false
  };
}
```


##### `mapResults`
Retrieves a mapper function to figure out results and meta data. By default, we assume the API just returns all matched entities as an array, without any additional meta data - there may be cases though where your response data is wrapped inside a `results` field, for example. This callback allows you to unwrap the results and set more meta fields on your responses.
As I said you can set additional meta data fields here, the most popular being "count" and "total". Count reflects the number of retrieved items (usually the length of the response data, but there are additional concerns where using an API-provided value might be better), Total is the total number of available, matching entities on the server. This is most useful for paginated results.
Beyond these, there might be more fields you want to populate. The `ApiResponse` object will provide getters for any of them, so what you want to do here is populate the fields with values from the response data.  
Since we receive the actual `AxiosResponse` object here, we also have access to headers and so on.  

The only mandatory key in the return object is "results". Count will be set to the results length, total to "-1" if missing.

```js
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
```

##### `mapFilters`
Retrieves a mapper function to assemble the filter parameter value. This might sound a little
complicated first, but bear with me: if you decide to filter your results, a parameter named
"filter_columns" (or whatever you set in defaultParameterNames for filterColumns) will be
appended to your request URL. The value of this property might require a special format to be
understood by your API, so this callback gives you a possibility to create the string on your
own. What you will receive is an object structured as `{ "my-FieldName": "filter value"}`,
so the below approach to map the entries might work best.
Whatever the output you require, just return a string in the end.

By default, the output looks like so:
`'my-FieldName:filter value,my-other_field:123,foo:true'`

```js
static get mapFilters () {
  return filters => Object
    .entries( filters )
    .map( ( [ field, value ] ) => `${field}:${value}` )
    .join( ',' );
}
```

##### `mapOrders`
Retrieves a mapper function to assemble the order parameter value, should you use multiple field ordering. The same things said for "mapFilters" apply here, too: Multi-ordering might be complex in your application, so you can use this to create a custom field value.

```js
static get mapOrders () {
  return orders => Object
    .entries( orders )
    .map( ( [ field, direction ] ) => `${field}:${direction}` )
    .join( ',' );
}
```

## Compatibility with other frameworks (React, Angular, [Vanilla](http://vanilla-js.com/))
Basically, [src/index.js](./src/index.js) provides a Vue plugin. There is nothing special happening there you wouldn't be able to recreate in any other framework. Important are just the following lines:

```js
Vue.prototype.$api = new Api( options.baseUrl, options );

    for ( let EndpointClass of options.endpoints ) {
      Vue.prototype.$api.mount( new EndpointClass() );
    }
```

which translate directly to:

```js
const api = new Api( options.baseUrl, options );

    for ( let EndpointClass of options.endpoints ) {
        api.mount( new EndpointClass() );
    }
```

If there is anyone interested in providing plugins for other frameworks and would be willing to create a PR, I'll merge it.

## Contribution
I'm happy for anyone contributing code! Ideas:

 - Implement testing
 - Automatic, selective cache purging
 - More examples
 -

Sprinkled throughout this readme are several other points that could be improved upon. If you're unsure, just open an issue.
