<template>
  <div class="code-snippet">
    <h3 v-if="title" class="snippet-title">{{ title }}</h3>
    <highlight language="js">
      <slot></slot>
    </highlight>
  </div>
</template>

<script>
  import highlightJs from 'highlight.js';
  import JavaScript  from 'highlight.js/lib/languages/javascript';
  import Highlight   from 'vue-highlight-component';

  // Register the language if it's not supported by default
  highlightJs.registerLanguage( 'js', JavaScript );

  export default {
    name: 'code-snippet',

    props: {
      title: {
        type:     String,
        required: false
      }
    },

    components: {
      Highlight
    }
  };
</script>
