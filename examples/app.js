'use strict';

/*
 global window,
 document
 */

import Vue              from 'vue';
import api              from '../src';
import apiConfiguration from './config';

Vue.use( api, apiConfiguration );

const app = new Vue(
  {
    el: '#app',

    template: '#app-template',

    data: {
      limitInput:  null,
      offsetInput: null,
      photos:      []
    },

    methods: {
      async fetchPhotos () {
        const limit          = this.limitInput || 10;
        const offset         = this.offsetInput || 0;
        const photosResponse = await this.$api.photos
                                         .paginate( limit, offset )
                                         .index();

        console.log( 'received response', photosResponse );

        this.photos = photosResponse.results;
      },
    }
  }
);

window.app = app;
