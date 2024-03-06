import { getCssVar } from 'quasar';
import { App } from 'vue';

export default {
  // not using options here - left it as an example of passing options to plugins
  install: (app: App /* , options?: Record<string, unknown> */) => {
    app.config.globalProperties.$getColor = (colorAlias: string) => {
      return getCssVar(colorAlias);
    };
  },
};
