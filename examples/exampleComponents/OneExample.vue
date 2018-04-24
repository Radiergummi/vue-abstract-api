<template>
  <div>
    <div class="fetch-photo">
      <span>Fetch photo with ID </span><input type="number" min="1" v-model="idInput">
      <button v-on:click="fetchPhoto">Fetch</button>
      <transition name="fade">
        <div class="loading-indicator" v-show="loading"></div>
      </transition>
    </div>
    <pre class="code-preview">await $api.photos.one({{ idInput }});</pre>
    <div v-if="photo">
      <h2>{{ photo.title }}</h2>
      <img :src="photo.thumbnailUrl" :alt="photo.id">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OneExample',

    data () {
      return {
        idInput: 1,
        photo:   null,
        loading: false
      };
    },

    methods: {
      async fetchPhoto () {
        this.loading = true;

        console.group( 'API Request' );
        console.info( 'Starting request' );
        console.time( 'API call duration' );

        this.photo = await this.$api.photos.one( this.idInput );

        console.timeEnd( 'API call duration' );
        console.groupEnd();

        this.loading = false;
      }
    }
  };
</script>
