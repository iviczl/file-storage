import Vue from 'vue';
import router from './router.js';
import App from './App.vue';
import { loadSettings } from '@/modules/util.js';

async function main()
{
  const settings = await loadSettings('appSettings.json');
  window.Config = settings;

  Vue.config.productionTip = false;

  let app = new Vue({
    router,
    render: h => h(App)
  });

  app.$mount('#app');
}
main();