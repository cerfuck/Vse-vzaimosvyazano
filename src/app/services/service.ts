import store from '../../store';
import { utils } from '../../utils';
import {events} from '../../events';

// import { LocalStorage } from 'web-storage';
// import Person from '../../model-storage/models/person/person';
// import { ModelStorage } from '../../model-storage';
// import { storageMarks } from '../../app/storage-marks';

// import { generateId } from '../../util';

export default class Service {
  public utils: Object = utils;
  constructor(name) {

  }

  public listenEvent(type: string, callback: Function) {
    store.subscribe(() => {
      console.error('store.getState().event', store.getState().event);
      let event = store.getState().event;
      if (event.type === type) {
        callback(event.payload);
      }
    });
  }

  public publishEvent(type: string, payload?: any) {
    store.dispatch({type, payload});
  }
}
