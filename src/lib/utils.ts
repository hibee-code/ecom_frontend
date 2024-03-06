import { Loading } from 'quasar';
import { BaseModel } from '../models/base.model';

export function validateField(model: BaseModel, name: string) {
  const error = model.errors?.find((error) => error.property === name);
  const errorMessages = Object.values(error?.constraints || {})?.pop() || '';
  return errorMessages === '' ? true : errorMessages;
}

export function getHighestZIndex() {
  let highestZIndex = 0;
  if (document && window) {
    const elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
      const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
      if (zIndex && zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    }
  }
  // console.log('current heighest z-index: ', highestZIndex);
  return highestZIndex;
}

export function clearUIEffects({
  loader,
  timer,
}: { loader?: Loading; timer?: NodeJS.Timeout } = {}) {
  loader && loader.hide();
  timer && clearTimeout(timer);
}

export function isModelValid(model: BaseModel) {
  return !model.errors?.length;
}
