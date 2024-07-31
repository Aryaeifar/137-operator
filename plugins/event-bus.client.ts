import eventBus from '../helpers/eventBus';

export default defineNuxtPlugin(() => ({
  provide: {
    eventBus
  },
}));