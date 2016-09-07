import C from '../constants';
import _ from 'lodash';

const initialState = {
   responses: {
      sorting: "count",
      ascending: false,
      visibleStatuses: {
        "Human Optimal": true,
        "Human Sub-Optimal": true,
        "Algorithm Optimal": true,
        "Algorithm Sub-Optimal": true,
        "Unmatched": true,
        "Focus Point Hint": true,
        "Word Error Hint": true,
        "Punctuation Hint": true,
        "Capitalization Hint": true,
        "Missing Details Hint": true,
        "Not Concise Hint": true,
        "No Hint": true
      },
      expanded: {}  // this will contain response keys set to true or false;
   }
}

export default function(currentState, action) {
   var newState;
   switch (action.type) {
      case C.TOGGLE_EXPAND_SINGLE_RESPONSE:
         newState = _.cloneDeep(currentState);
         newState.expanded[action.rkey] = !currentState.expanded[action.rkey];
         return newState;
      case C.COLLAPSE_ALL_RESPONSES:
         newState = _.cloneDeep(currentState);
         newState.expanded = {};
         return newState;
      case C.EXPAND_ALL_RESPONSES:
         newState = _.cloneDeep(currentState);
         newState.expanded = action.expandedResponses;
         return newState;
      case C.TOGGLE_STATUS_FIELD:
         newState = _.cloneDeep(currentState);
         newState.visibleStatuses[action.status] = !currentState.visibleStatuses[action.status];
         return newState;
      case C.TOGGLE_RESPONSE_SORT:
         newState = _.cloneDeep(currentState);
         if (currentState.sorting === action.field) {
            newState.ascending = !currentState.ascending;
         } else {
            newState.ascending = false;
            newState.sorting = action.field;
         }
         return newState;
      default:
         return currentState || initialState.responses;
   }
}
