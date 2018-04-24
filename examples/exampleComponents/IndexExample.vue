<template>
  <div>
    <div class="fetch-x-photos">
      <span>Fetch </span><input type="number" min="1"
                                v-model="limitInput"><span> photo{{ limitInput > 1 ? 's': '' }}, starting at </span><input
      type="number" min="0" size="4" v-model="offsetInput"><span
      v-show="limitInput > 1"><span> and order them </span><select v-model="orderDirectionInput"><option :value="false">not at all</option><option
      value="ASC">ascending</option><option value="DESC">descending</option></select><span> by </span><select
      v-model="orderFieldInput"><option value="id">ID</option><option
      value="title">title</option></select></span>
      <button v-on:click="fetchPhotos">Fetch</button>
      <transition-group name="fade">
        <div class="loading-indicator" :key="0" v-show="loading"></div>
        <div class="error-indicator" :key="1" v-show="error"></div>
      </transition-group>
    </div>
    <code-snippet title="Code example">
      await $api.photos.paginate({{ limitInput }}{{ offsetInput > 0 ? ', ' + offsetInput : '' }}){{ limitInput > 1 ?
      `.orderBy('${orderFieldInput}', '${orderDirectionInput}')` : '' }}.index();
    </code-snippet>
    <ul>
      <li v-for="photo in photos" :key="photo.id">
        <h2>{{ photo.title }}</h2>
        <img :src="photo.thumbnailUrl" :alt="photo.id">
      </li>
    </ul>
  </div>
</template>

<script>
  import CodeSnippet from './CodeSnippet';

  export default {
    name:       'IndexExample',
    components: { CodeSnippet },
    data () {
      return {
        limitInput:          1,
        offsetInput:         0,
        orderDirectionInput: 'ASC',
        orderFieldInput:     'id',
        lastResponse:        null,
        photos:              [],
        loading:             false,
        error:               false
      };
    },

    methods: {
      async fetchPhotos () {
        this.loading = true;

        const limit  = this.limitInput || 10;
        const offset = this.offsetInput || 0;

        console.group( 'API Request' );
        console.info( 'Starting request' );
        console.time( 'API call duration' );

        try {
          this.lastResponse = await this.$api.photos
                                        .paginate( limit, offset )
                                        .orderBy( this.orderFieldInput, this.orderDirectionInput )
                                        .index();
          this.error        = false;
        } catch ( error ) {
          this.error = true;
          alert( `An error occurred: ${error.message}` );
        }

        console.timeEnd( 'API call duration' );

        if ( this.lastResponse ) {
          console.info(
            `Received response from ${this.lastResponse.url}%c${this.lastResponse.fromCache ? ' [cached]' : ''}:`,
            'font-weight:bold'
          );
          console.info( `Status code: ${this.lastResponse.statusCode}` );
          console.groupCollapsed( 'Response headers:' );
          console.table( this.lastResponse.headers );
          console.groupEnd();
          console.groupCollapsed( 'Response body:' );
          console.info( this.lastResponse.results );
          console.groupEnd();
          console.groupCollapsed( 'Response object:' );
          console.info( this.lastResponse );
          console.groupEnd();
        }

        console.groupEnd();

        this.photos  = this.lastResponse ? this.lastResponse.results : [];
        this.loading = false;
      }
    }
  };
</script>
