<template>
  <div>
    <div class="fetch-all-photos">
      <span>Fetch all photos</span>
      <button v-on:click="fetchPhotos">Fetch</button>
      <transition-group name="fade">
        <div class="loading-indicator" :key="0" v-show="loading"></div>
        <div class="error-indicator" :key="1" v-show="error"></div>
      </transition-group>
    </div>
    <code-snippet title="Code example">
      await $api.photos.all();
    </code-snippet>
    <button v-for="photo in photos" :key="photo.id" v-on:click="showPhoto(photo.id)">{{ photo.id }}</button>
  </div>
</template>

<script>

  import CodeSnippet from './CodeSnippet';

  export default {
    name:       'AllExample',
    components: { CodeSnippet },
    data () {
      return {
        photos:  [],
        loading: false,
        error:   false
      };
    },

    mounted () {
    },

    methods: {
      async fetchPhotos () {
        this.loading = true;

        console.group( 'API Request' );
        console.info( 'Starting request' );
        console.time( 'API call duration' );

        try {
          this.photos = await this.$api.photos.all();
          this.error  = false;
        } catch ( error ) {
          this.error = true;
          alert( `An error occurred: ${error.message}` );
        }

        console.timeEnd( 'API call duration' );
        console.groupEnd();

        this.loading = false;
      },

      async showPhoto ( id ) {
        this.loading = true;

        let photo = {};

        try {
          photo      = await this.$api.photos.one( id );
          this.error = false;
        } catch ( error ) {
          this.error = true;
          alert( `An error occurred: ${error.message}` );
        }

        this.loading = false;
        alert( `Title of the photo with ID ${id} is "${photo.title}".` );
      }
    }
  };
</script>
