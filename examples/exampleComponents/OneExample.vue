<template>
  <div>
    <div class="fetch-photo">
      <span>Fetch photo with ID </span><input type="number" min="1" v-model="idInput">
      <button v-on:click="fetchPhoto">Fetch</button>
      <transition-group name="fade">
        <div class="loading-indicator" :key="0" v-show="loading"></div>
        <div class="error-indicator" :key="1" v-show="error"></div>
      </transition-group>
    </div>
    <code-snippet title="Code example">
      await $api.photos.one({{ idInput }});
    </code-snippet>
    <div v-if="photo">
      <h2>{{ photo.title }}</h2>
      <img :src="photo.thumbnailUrl" :alt="photo.id">
    </div>
  </div>
</template>

<script>
  import CodeSnippet from './CodeSnippet';

  export default {
    name:       'OneExample',
    components: { CodeSnippet },
    data () {
      return {
        idInput: 1,
        photo:   null,
        loading: false,
        error:   false
      };
    },

    methods: {
      async fetchPhoto () {
        this.loading = true;

        console.group( 'API Request' );
        console.info( 'Starting request' );
        console.time( 'API call duration' );

        try {
          this.photo = await this.$api.photos.one( this.idInput );
          this.error = false;
        } catch ( error ) {
          this.error = true;
          alert( `An error occurred: ${error.message}` );
          console.error( 'Request error: ', error );
        }

        console.timeEnd( 'API call duration' );
        console.groupEnd();

        this.loading = false;
      }
    }
  };
</script>
