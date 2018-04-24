<template>
  <div>
    <div class="fetch-all-photos">
      <span>Fetch all photos</span>
      <button v-on:click="fetchPhotos">Fetch</button>
      <transition name="fade">
        <div class="loading-indicator" v-show="loading"></div>
      </transition>
    </div>
    <pre class="code-preview">await $api.photos.all();</pre>
    <button v-for="photo in photos" :key="photo.id" v-on:click="showPhoto(photo.id)">{{ photo.id }}</button>
  </div>
</template>

<script>

  export default {
    name: 'AllExample',

    data () {
      return {
        photos:  [],
        loading: false
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

        this.photos = await this.$api.photos.all();

        console.timeEnd( 'API call duration' );
        console.groupEnd();

        this.loading = false;
      },

      async showPhoto ( id ) {
        this.loading = true;

        const photo = await this.$api.photos.one( id );

        this.loading = false;
        alert( `Title of the photo with ID ${id} is "${photo.title}".` );
      }
    }
  };
</script>
