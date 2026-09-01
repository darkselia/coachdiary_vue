import './assets/main.css';
import './assets/public-pages.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

import { createVuetify } from 'vuetify';
import { ru } from 'vuetify/locale';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#f0f8ff',
    surface: '#e9f4f6',
    'surface-bright': '#d7e1e4',
    'surface-light': '#f1fcff',
    'surface-variant': '#b8c1c3',
    'on-surface-variant': '#EEE',
    primary: '#003f50',
    'primary-lighten-1': '#005f6a',
    'primary-lighten-2': '#0099c2',
    'primary-darken-1': '#001f25',
    'primary-darken-2': '#00161c',
    secondary: '#f2df73',
    'secondary-darken-1': '#bfb05a',
    error: '#B00020',
    info: '#007b9c',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'border-radius': '8px',
    'border-button-radius': '12px',
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.6,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'public-primary-border': 'rgba(var(--v-theme-primary), 0.18)',
    'public-primary-border-strong': 'rgba(var(--v-theme-primary), 0.28)',
    'public-primary-tint': 'rgba(var(--v-theme-primary), 0.05)',
    'public-primary-tint-strong': 'rgba(var(--v-theme-primary), 0.08)',
    'public-card-shadow': 'rgba(0, 63, 80, 0.08)',
    'public-info-tint': 'rgba(var(--v-theme-info), 0.12)',
    'public-warning-tint': 'rgba(var(--v-theme-secondary), 0.35)',
    'public-danger-tint': 'rgba(var(--v-theme-error), 0.1)',
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  },
};

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  defaults: {
    VBtn: {
      variant: 'flat',
      class: 'font-weight-bold text-none',
      color: 'primary',
    },
    VTextField: {
      variant: 'outlined',
      hideDetails: true,
    },
    VRadioGroup: {
      hideDetails: true,
    },
    VCheckbox: {
      hideDetails: true,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: { myCustomLightTheme },
  },
});

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(autoAnimatePlugin);

app.mount('#app');
