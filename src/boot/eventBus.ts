import { EventBus } from 'quasar';
import { boot } from 'quasar/wrappers';
import { EventNamesEnum } from 'src/lib/enums/events.enum';

// regist $eventBus hook
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $eventBus: EventBus;
  }
}

export default boot(({ app }) => {
  const eventBus = new EventBus<{
    [EventNamesEnum.SIGN_IN]: () => void;
  }>();

  app.provide('eventBus', eventBus);
});
