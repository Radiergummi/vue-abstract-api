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
      <transition name="fade">
        <div class="loading-indicator" v-show="loading"></div>
      </transition>
    </div>
    <pre class="code-preview">await $api.photos.paginate({{ limitInput }}{{ offsetInput > 0 ? ', ' + offsetInput : '' }}){{ limitInput > 1 ? `.orderBy(${orderFieldInput}, ${orderDirectionInput})` : '' }}.index();</pre>
    <ul>
      <li v-for="photo in photos" :key="photo.id">
        <h2>{{ photo.title }}</h2>
        <img :src="photo.thumbnailUrl" :alt="photo.id">
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'IndexExample',

    data () {
      return {
        limitInput:          1,
        offsetInput:         0,
        orderDirectionInput: 'ASC',
        orderFieldInput:     'id',
        photos:              [],
        loading:             false
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

        const photosResponse = await this.$api.photos
                                         .paginate( limit, offset )
                                         .orderBy( this.orderFieldInput, this.orderDirectionInput )
                                         .index();

        console.timeEnd( 'API call duration' );
        console.info(
          `Received response from ${photosResponse.url}%c${photosResponse.fromCache ? ' [cached]' : ''}:`,
          'font-weight:bold'
        );
        console.info( `Status code: ${photosResponse.statusCode}` );
        console.groupCollapsed( 'Response headers:' );
        console.table( photosResponse.headers );
        console.groupEnd();
        console.groupCollapsed( 'Response body:' );
        console.info( photosResponse.results );
        console.groupEnd();
        console.groupCollapsed( 'Response object:' );
        console.info( photosResponse );
        console.groupEnd();
        console.groupEnd();

        this.photos  = photosResponse.results;
        this.loading = false;
      }
    }
  };
</script>
