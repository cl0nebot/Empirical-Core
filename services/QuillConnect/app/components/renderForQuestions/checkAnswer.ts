declare function require(name:string);
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import * as _ from 'underscore';
import {checkSentenceCombining, checkDiagnosticQuestion} from 'quill-marking-logic';
import { getParameterByName } from '../../libs/getParameterByName';
import { getActivitySessionInteractionService } from 'quill-service-library';


export default function checkAnswer(question, response, responses, mode='default') {
  const service = getActivitySessionInteractionService(getParameterByName('student'));
  service.sendActivitySessionInteractionLog({ info: 'answer check', current_question: question.key })
  const defaultConceptUID = question.modelConceptUID || question.conceptID
  const fields = {
    responses: responses ? hashToCollection(responses) : [],
    questionUID: question.key,
    focusPoints: question.focusPoints ? hashToCollection(question.focusPoints): [],
    incorrectSequences: question.incorrectSequences ? hashToCollection(_.compact(question.incorrectSequences)) : [],
    defaultConceptUID
  };
  const newResponse = checkSentenceCombining(fields.questionUID, response, fields.responses, fields.focusPoints, fields.incorrectSequences, fields.defaultConceptUID)
  return {response: newResponse};
}
