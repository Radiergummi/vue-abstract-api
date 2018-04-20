# vue-abstract-api
> This is a lean API connector for Vue.js (though there is no dependency: You can use this in any framework you'd like to).


## Features
 - Abstraction of endpoints and resources into extendable classes
 - Flexible configuration using class properties
 - Well documented, readable code
 - Adapts to almost any API structure


## Installation
To install the plugin, just `npm install` it.

```bash
npm install vue-abstract-api
```

For development:
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
The API configuration is a plain object with two parameters: The `baseURL` which holds the common shared URL for all of your endpoints, and `endpoints`, an Array holding all of said endpoints.
What you want to do here is put in all of your endpoint classes (no instances) just as you imported them so the plugin knows about them. In the background, the endpoints will be *mounted* on the `Api` instance, providing them with access to the HTTP driver and more.

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

The following list shows all available getters. To view an example of a fully configured endpoint, take a look at [`examples/endpoints/Photos`](./examples/endpoints/Photos.js).
