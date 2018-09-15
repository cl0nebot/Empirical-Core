import request from 'request'
import Pusher from 'pusher-js';
import { push } from 'react-router-redux';
import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Questions, Question } from '../interfaces/questions'
import * as responseActions from './responses'
import { Response, ConceptResult } from 'quill-marking-logic'
import _ from 'underscore';
export interface SavedResponse {
  author?: string|null,
  feedback?: string|null,
  first_attempt_count?: number|null,
  child_count?: number|null,
  concept_results?: string|null|{[key: string]: boolean}
  conceptResults?: ConceptResult[]
  count: number,
  created_at?: string,
  id: number,
  key?: string,
  optimal?: Boolean|null,
  parent_uid?: string|null,
  parent_id?: number|string|null,
  parentId?: number|string|null,
  question_uid: string,
  sortOrder?: number,
  statusCode?: number
  uid?: string|null,
  updated_at?: string,
  text: string,
  weak?: Boolean|null,
  spelling_error?: Boolean|null,
}

export const startListeningToQuestions = () => {
  return (dispatch:Function) => {
    questionsRef.on('value', (snapshot:any) => {
      const questions: Questions = snapshot.val()
      if (questions) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTIONS_DATA, data: questions, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND })
      }
    });
  }
}

export const getGradedResponsesWithCallback = (questionID: string, callback: Function) => {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    }
    const bodyToObj: {[key: string]: SavedResponse} = {};
    JSON.parse(body).forEach((resp: SavedResponse) => {
      bodyToObj[resp.id] = resp;
      if (typeof resp.concept_results === 'string') {
        const parsed: { [key: string]: boolean } = JSON.parse(resp.concept_results)
        resp.concept_results = parsed;
      }
      resp.conceptResults = [];
      if (resp.concept_results && typeof resp.concept_results === 'object') {
        for (const cr in resp.concept_results) {
          if (resp.concept_results.hasOwnProperty(cr)) {
            const formattedCr: ConceptResult = { conceptUID: '', correct: false};
            formattedCr.conceptUID = cr;
            formattedCr.correct = resp.concept_results[cr];
            resp.conceptResults.push(formattedCr);
          }
        }
        delete resp.concept_results;
      }
    });
    callback(bodyToObj);
  });
}

export const updateFlag = (qid: string, flag: string) => {
  return (dispatch:Function) => {
    questionsRef.child(`${qid}/flag/`).set(flag, (error: Error | null): any | undefined => {
      if (error) {
        alert(`Flag update failed! ${error}`);
      }
    });
  }
}

export const incrementRequestCount = () => {
  return { type: ActionTypes.INCREMENT_REQUEST_COUNT }
}

export const toggleNewQuestionModal = () => {
  return {type: ActionTypes.TOGGLE_NEW_QUESTION_MODAL }
}

export const searchResponses = (qid:string) => {
  return (dispatch:Function, getState:Function) => {
    const requestNumber = getState().filters.requestCount
    // check for request number in state, save as const
    request(
      {
        url: `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
        method: 'POST',
        json: { search: getFormattedSearchData(getState()), },
      },
      (err, httpResponse, data) => {
        // check again for number in state
        // if equal to const set earlier, update the state
        // otherwise, do nothing
        if (getState().filters.requestCount === requestNumber && data) {
          const embeddedOrder = _.map(data.results, (response: {[x: string]: any}, i) => {
            response.sortOrder = i;
            return response;
          });
          const parsedResponses = _.keyBy(embeddedOrder, 'id');
          const responseData = {
            responses: parsedResponses,
            numberOfResponses: data.numberOfResults,
            numberOfPages: data.numberOfPages,
          };
          dispatch(updateResponses(responseData));
        }
      }
    );
  };
}

export const getFormattedSearchData = (state) =>{
  const searchData = state.filters.formattedFilterData;
  searchData.text = state.filters.stringFilter;
  searchData.pageNumber = state.filters.responsePageNumber;
  return searchData;
}


export const updateResponses = (data: Array<Response>) =>{
  return { type: ActionTypes.UPDATE_SEARCHED_RESPONSES, data, };
}

export const initializeSubscription = (qid:string) => {
  return (dispatch:Function) => {
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    if (!window.pusher) {
      window.pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    }
    const channel = window.pusher.subscribe(`admin-${qid}`);
    channel.bind('new-response', (data) => {
      setTimeout(() => dispatch(searchResponses(qid)), 1000);
    });
  };
}

export const removeSubscription = (qid:string) => {
  return (dispatch:Function) => {
    if (window.pusher) {
      window.pusher.unsubscribe(`admin-${qid}`);
    }
  };
}

export const submitNewQuestion = (content:Question) => {
  return (dispatch:Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_QUESTION_RESPONSE, });
    const newRef = questionsRef.push(content, (error:string) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_QUESTION_RESPONSE, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        const action = push(`/admin/questions/${newRef.key}`);
        dispatch(action);
      }
    });
    content.answers.forEach(a => dispatch(saveOptimalResponse(newRef.key, content.concept_uid, a)))
  };
}

export const startQuestionEdit = (qid: string) => {
  return { type: ActionTypes.START_QUESTION_EDIT, qid, };
}

export const cancelQuestionEdit = (qid: string) => {
  return { type: ActionTypes.FINISH_QUESTION_EDIT, qid, };
}

export const submitQuestionEdit = (qid: string, content: Question) => {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: ActionTypes.SUBMIT_QUESTION_EDIT, qid, });
    content.answers.forEach(a => dispatch(saveOptimalResponse(qid, content.concept_uid, a)))
    questionsRef.child(qid).update(content, (error: string) => {
      dispatch({ type: ActionTypes.FINISH_QUESTION_EDIT, qid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export const saveOptimalResponse = (qid: string, conceptUid: string, answer: {text: string}) => {
  return (dispatch:Function) => {
    if (answer.text) {
      const conceptResults = [{[conceptUid]: true}]
      const formattedResponse = {
        optimal: true,
        count: 1,
        text: answer.text.replace(/{|}/gm, ''),
        question_uid: qid,
        feedback: "<b>Well done!</b> That's the correct answer.",
        concept_results: conceptResults
      }
      dispatch(responseActions.submitResponse(formattedResponse, null, false))
    }
  }
}

export const updateStringFilter = (stringFilter: string, qid: string) => {
  return (dispatch:Function) => {
    dispatch(setStringFilter(stringFilter));
    dispatch(searchResponses(qid));
  };
}

export const setStringFilter = (stringFilter: string) => {
  return { type: ActionTypes.SET_RESPONSE_STRING_FILTER, stringFilter, };
}

export const startResponseEdit = (qid: string, rid: string) => {
  return { type: ActionTypes.START_RESPONSE_EDIT, qid, rid, };
}

export const updatePageNumber = (pageNumber: Number, qid: string) => {
  return (dispatch:Function) => {
    dispatch(setPageNumber(pageNumber));
    dispatch(searchResponses(qid));
  };
}

export const setPageNumber = (pageNumber: Number) => {
  return { type: ActionTypes.SET_RESPONSE_PAGE_NUMBER, pageNumber, };
}

export const clearQuestionState = (qid: string) => {
  return { type: ActionTypes.CLEAR_QUESTION_STATE, qid, };
}

export const startChildResponseView = (qid: string, rid: string) => {
  return { type: ActionTypes.START_CHILD_RESPONSE_VIEW, qid, rid, };
}

export const cancelChildResponseView = (qid: string, rid: string) => {
  return { type: ActionTypes.CANCEL_CHILD_RESPONSE_VIEW, qid, rid, };
}
