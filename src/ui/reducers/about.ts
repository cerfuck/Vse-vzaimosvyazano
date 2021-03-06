import { events } from '../../events';
import { pagesType } from '../../io/types';
import { connector } from '../../constants';


let initialState = {
  contentText: ''
};

export type aboutType = {
  contentText: string;
};

export default function about<Reducer>(state: aboutType = initialState, action) {
  switch (action.type) {
    case events.saver.PAGES:
    case events.about.DRAW_ABOUT_CONTENT:
      return Object.assign({}, state, {
        contentText: (action.payload.id === connector.PAGE_ABOUT) ?
            action.payload.text :
            state.contentText
      });
    default:
      return state;
  }
}
