<template>
  <article id="content">
    <header class="main-header">
      <h1>Welcome to <code>vue-abstract-api</code>!</h1>
      <div class="header-actions">
        <a href="https://github.com/Radiergummi/vue-abstract-api" target="_blank" class="go go-github"
           data-site="GitHub">
          <img class="logo logo-github" src="./assets/github.svg">
        </a>
        <a href="https://npmjs.com/package/vue-abstract-api" target="_blank" class="go go-npm" data-site="NPM">
          <img class="logo logo-npm" src="./assets/npm.svg">
        </a>
      </div>
    </header>

    <section id="intro">
      <p>
        This page shows some of the features of vue-abstract-api. You can either play with the snippets on this
        page or open up the browser console: <code>app.$api</code> is attached to window.
      </p>
    </section>

    <div id="demo">

      <section class="example" id="example-index">
        <header class="example-header">
          <a href="#example-index" class="block-link">
            <h2 class="example-title">Index</h2>
            <span class="example-description">Retrieves all entities from an endpoint</span>
          </a>
        </header>
        <index-example></index-example>
      </section>

      <section class="example" id="example-one">
        <header class="example-header">
          <a href="#example-one" class="block-link">
            <h2 class="example-title">One</h2>
            <span class="example-description">Retrieves a single entity by ID</span>
          </a>
        </header>
        foo
      </section>
    </div>
  </article>
</template>

<script>
  import IndexExample from './exampleComponents/IndexExample';

  export default {
    name: 'App',

    components: {
      IndexExample
    }
  };
</script>

