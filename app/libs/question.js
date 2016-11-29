import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
import constants from '../constants';
import {diffWords} from 'diff';
import {checkForMissingWords} from './requiredWords';
import {
  checkChangeObjectMatch
} from './algorithms/changeObjects'
const jsDiff = require('diff');

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: "MISSING_WORD",
  ADDITIONAL_WORD: "ADDITIONAL_WORD",
  INCORRECT_WORD: "INCORRECT_WORD"
}

String.prototype.normalize = function() {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
}

export default class Question {
  constructor(data) {
    console.log(data)
    this.prompt = data.prompt;
    this.sentences = data.sentences;
    this.responses = data.responses;
    this.questionUID = data.questionUID
    this.focusPoints = data.focusPoints || [];
  }

  getOptimalResponses() {
    return _.where(this.responses, {optimal: true})
  }

  getSubOptimalResponses(responses) {
    return _.filter(this.responses, function (resp){
      return resp.parentID === undefined && resp.feedback !== undefined && resp.optimal !== true
    })
  }

  getTopOptimalResponse() {
    return _.sortBy(this.getOptimalResponses(), (r) => {
      return r.count
    }).reverse()[0]
  }

  getWeakResponses() {
    return _.filter(this.responses, function (resp) {
      return resp.weak === true
    })
  }

  getCommonUnmatchedResponses() {
    return _.filter(this.responses, function (resp) {
      return resp.feedback === undefined && resp.count > 2
    })
  }

  getSumOfWeakAndCommonUnmatchedResponses() {
    return this.getWeakResponses().length + this.getCommonUnmatchedResponses().length
  }

  getPercentageWeakResponses() {
    return (this.getSumOfWeakAndCommonUnmatchedResponses() / this.responses.length * 100).toPrecision(4)
  }

  checkMatch(response) {
    // remove leading and trailing whitespace
    response = response.trim();
    // make sure all words are single spaced
    response = response.replace(/\s{2,}/g, ' ');
    var returnValue = {
      found: true,
      submitted: response,
      response: {
        text: response,
        questionUID: this.questionUID,
        count: 1
      }

    }

    let res = returnValue.response;
    var exactMatch = this.checkExactMatch(response)
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch
      return returnValue
    }
    var focusPointMatch = this.checkFocusPointMatch(response)
    if (focusPointMatch !== undefined) {
      res.feedback = focusPointMatch.feedback;
      res.author = "Focus Point Hint";
      res.parentID = this.getTopOptimalResponse().key;
      return returnValue;
    }
    var lowerCaseMatch = this.checkCaseInsensitiveMatch(response)
    if (lowerCaseMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.caseError;
      res.author = "Capitalization Hint"
      res.parentID = lowerCaseMatch.key
      return returnValue
    }
    var punctuationMatch = this.checkPunctuationInsensitiveMatch(response)
    if (punctuationMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.punctuationError;
      res.author = "Punctuation Hint"
      res.parentID = punctuationMatch.key
      return returnValue
    }
    var punctuationAndCaseMatch = this.checkPunctuationAndCaseInsensitiveMatch(response)
    if (punctuationAndCaseMatch !== undefined) {


      res.feedback = constants.FEEDBACK_STRINGS.punctuationAndCaseError;
      res.author = "Punctuation and Case Hint"
      res.parentID =  punctuationAndCaseMatch.key
      return returnValue
    }
    var changeObjectMatch = this.checkChangeObjectRigidMatch(response)
    if (changeObjectMatch !== undefined) {
      switch (changeObjectMatch.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.modifiedWordError;
          res.author = "Modified Word Hint"
          res.parentID = changeObjectMatch.response.key
          return returnValue
        case ERROR_TYPES.ADDITIONAL_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.additionalWordError;
          res.author = "Additional Word Hint"
          res.parentID = changeObjectMatch.response.key
          return returnValue
        case ERROR_TYPES.MISSING_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.missingWordError;
          res.author = "Missing Word Hint"
          res.parentID = changeObjectMatch.response.key
          return returnValue
        default:
          return
      }
    }
    var changeObjectFlexMatch = this.checkChangeObjectFlexibleMatch(response)
    if (changeObjectFlexMatch !== undefined) {
      switch (changeObjectFlexMatch.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.modifiedWordError;
          res.author = "Flexible Modified Word Hint"
          res.parentID = changeObjectFlexMatch.response.key
          return returnValue
        case ERROR_TYPES.ADDITIONAL_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.additionalWordError;
          res.author = "Flexible Additional Word Hint"
          res.parentID = changeObjectFlexMatch.response.key
          return returnValue
        case ERROR_TYPES.MISSING_WORD:

          res.feedback = constants.FEEDBACK_STRINGS.missingWordError;
          res.author = "Flexible Missing Word Hint"
          res.parentID = changeObjectFlexMatch.response.key
          return returnValue
        default:
          return
      }
    }
    var whitespaceMatch = this.checkWhiteSpaceMatch(response)
    if (whitespaceMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.whitespaceError;
      res.author = "Whitespace Hint"
      res.parentID = whitespaceMatch.key
      return returnValue
    }
    var requiredWordsMatch = this.checkRequiredWordsMatch(response)
    if (requiredWordsMatch !== undefined) {
      ;
      res.feedback = requiredWordsMatch.feedback;
      res.author = "Required Words Hint"
      res.parentID = this.getTopOptimalResponse().key
      return returnValue
    }
    var minLengthMatch = this.checkMinLengthMatch(response)
    if (minLengthMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.minLengthError;
      res.author = "Missing Details Hint"
      res.parentID = minLengthMatch.key
      return returnValue
    }
    var maxLengthMatch = this.checkMaxLengthMatch(response)
    if (maxLengthMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.maxLengthError;
      res.author = "Not Concise Hint"
      res.parentID = maxLengthMatch.key
      return returnValue
    }
    var lowerCaseStartMatch = this.checkCaseStartMatch(response)
    if (lowerCaseStartMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.caseError;
      res.author = "Capitalization Hint"
      res.parentID = lowerCaseStartMatch.key
      return returnValue
    }
    var punctuationEndMatch = this.checkPunctuationEndMatch(response)
    if (punctuationEndMatch !== undefined) {

      res.feedback = constants.FEEDBACK_STRINGS.punctuationError;
      res.author = "Punctuation Hint"
      res.parentID = punctuationEndMatch.key
      return returnValue
    }
    returnValue.found = false
    return returnValue
  }

  nonChildResponses(responses) {
    return _.filter(this.responses, function (resp){
      return resp.parentID === undefined && resp.feedback !== undefined
    })
  }

  checkExactMatch(response) {
    return _.find(this.responses, (resp) => {
      return resp.text.normalize() === response.normalize();
    });
  }

  checkCaseInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return resp.text.normalize().toLowerCase() === response.normalize().toLowerCase();
    });
  }

  checkCaseStartMatch(response) {
    if (response[0] && response[0].toLowerCase() === response[0]) {
      return this.getTopOptimalResponse()
    }
  }

  checkPunctuationEndMatch(response) {
    var lastChar = response[response.length - 1]
    if (lastChar && lastChar.match(/[a-z]/i)) {
      return this.getTopOptimalResponse()
    }
  }

  checkPunctuationInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removePunctuation(resp.text.normalize()) === removePunctuation(response.normalize())
    });
  }

  checkPunctuationAndCaseInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      const supplied = removePunctuation(response.normalize()).toLowerCase()
      const target = removePunctuation(resp.text.normalize()).toLowerCase()
      return supplied === target
    });
  }

  checkWhiteSpaceMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removeSpaces(response.normalize()) === removeSpaces(resp.text.normalize())
    })
  }

  checkSmallTypoMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return getLowAdditionCount(response.normalize(), resp.text.normalize())
    });
  }

  checkChangeObjectRigidMatch(response) {
    const fn = (string) => {
      return string.normalize()
    }
    return checkChangeObjectMatch(response, this.getOptimalResponses(), fn)
  }

  checkChangeObjectFlexibleMatch(response) {
    const fn = (string) => {
      return removePunctuation(string.normalize()).toLowerCase()
    }
    return checkChangeObjectMatch(response, this.getOptimalResponses(), fn)
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(_.pluck(this.responses, "text"));
    const matches = set.get(response, []);
    var foundResponse = undefined;
    var text = undefined;
    if (matches.length > 0) {
      var threshold = (matches[0][1].length - 3) / matches[0][1].length
      text = (matches[0][0] > threshold) && (response.split(" ").length <= matches[0][1].split(" ").length) ? matches[0][1] : null;
    }
    if (text) {
      foundResponse = _.findWhere(this.responses, {text})
    }
    return foundResponse
  }

  checkRequiredWordsMatch(response) {
    return checkForMissingWords(response, this.getOptimalResponses());
  }

  checkMinLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 2) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const minLength = _.min(lengthsOfResponses) - 1
    if (response.split(" ").length < minLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.normalize().length
      })[0]
    } else {
      return undefined;
    }
  }

  checkMaxLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 2) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const maxLength = _.max(lengthsOfResponses) + 1
    if (response.split(" ").length > maxLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.normalize().length
      }).reverse()[0]
    } else {
      return undefined
    }
  }

  checkFocusPointMatch(response) {
    return _.find(this.focusPoints, (fp) => {
      return response.indexOf(fp.text) === -1;
    });
  }
}

export function removePunctuation (string) {
  return string.replace(/[^A-Za-z0-9\s]/g,"")
}

const removeSpaces = (string) => {
  return string.replace(/\s+/g, '');
}

// Check number of chars added.

const getLowAdditionCount = (newString, oldString) => {
  var diff = jsDiff.diffChars(newString, oldString)
  var additions = _.where(diff, {added: true})
  if (additions.length > 1) {
    return false
  }
  var count = _.reduce(additions, function(memo, num){ return memo + num.count; }, 0)
  if (count < 3) {
    return true
  }
  return false
}
