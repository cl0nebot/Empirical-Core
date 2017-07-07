import C from '../constants';
import _ from 'lodash';

const initialState = {
  session: {
    hasreceiveddata: false,
    submittingnew: false,
    onlyShowHeaders: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data
  },
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.UPDATE_CLASSROOM_SESSION_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    case C.TOGGLE_HEADERS:
      return Object.assign({}, currentstate, {
        onlyShowHeaders: !currentstate.onlyShowHeaders
      })
    default: return currentstate || initialState.session;
  }
}
