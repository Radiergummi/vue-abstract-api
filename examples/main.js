'use strict';

/*
 global window,
 document
 */

import Vue from 'vue';
import api from '../src';

import App              from './App';
import apiConfiguration from './config';

Vue.use( api, apiConfiguration );

const app = new Vue( {
                       el:         '#app',
                       template:   '<App/>',
                       components: { App }
                     } );

window.app = app;
