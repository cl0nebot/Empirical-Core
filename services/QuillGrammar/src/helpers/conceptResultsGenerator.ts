import { ConceptResult } from 'quill-marking-logic'
import * as _ from 'lodash'
import { Question, FormattedConceptResult } from '../interfaces/questions'

export function getConceptResultsForQuestion(question: Question): FormattedConceptResult[] {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  const attempts = question.attempts ? question.attempts : [];
  const answer = attempts[0].text;
  let unformattedConceptResults;
  if (attempts[0]) {
    unformattedConceptResults = attempts[0].concept_results || attempts[0].conceptResults || [];
  } else {
    unformattedConceptResults = [];
  }
  let conceptResults: ConceptResult[]|never  = Array.isArray(unformattedConceptResults) ? unformattedConceptResults : _.values(unformattedConceptResults)
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.concept_uid,
      correct: false,
    }];
  } else if (!conceptResults.find(cr => cr.conceptUID === question.concept_uid )) {
    conceptResults.push({
      conceptUID: question.concept_uid,
      correct: false,
    })
  }
  const directions = question.instructions;
  return conceptResults.map((conceptResult: ConceptResult) => {
    return {
      concept_uid: conceptResult.conceptUID,
      question_type: 'sentence-writing',
      metadata: {
        correct: conceptResult.correct ? 1 : 0,
        directions,
        prompt,
        answer,
        question_uid:  question.uid
      },
    }
  });
}

export function getNestedConceptResultsForAllQuestions(questions: Question[]) {
  return questions.map(questionObj => getConceptResultsForQuestion(questionObj));
}

export function embedQuestionNumbers(nestedConceptResultArray: FormattedConceptResult[][]): FormattedConceptResult[][] {
  return nestedConceptResultArray.map((conceptResultArray, index) => {
    return conceptResultArray.map((conceptResult: FormattedConceptResult) => {
      conceptResult.metadata.questionNumber = index + 1;
      conceptResult.metadata.questionScore = conceptResult.metadata.correct ? 1 : 0
      return conceptResult;
    })
  });
}

export function getConceptResultsForAllQuestions(questions: Question[]): FormattedConceptResult[] {
  const nested = getNestedConceptResultsForAllQuestions(questions);
  const withKeys = embedQuestionNumbers(nested);
  return [].concat.apply([], withKeys); // Flatten array
}

export function calculateScoreForLesson(questions: Question[]) {
  let correct = 0;
  questions.forEach((question) => {
    if (question.attempts) {
      correct += question.attempts.find((a) => !!a.optimal) ? 1 : 0
    }
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
