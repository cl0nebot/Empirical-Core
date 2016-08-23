import React from 'react'
import { connect } from 'react-redux'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionSelector from 'react-select-search'
import SortableList from 'react-anything-sortable'

const LessonForm = React.createClass({
  getInitialState: function () {
    const {currentValues} = this.props
    return {
      name: currentValues ? currentValues.name : "",
      introURL: currentValues ? currentValues.introURL || "" : "",
      selectedQuestions: currentValues ? currentValues.questions : [],
      flag: currentValues ? currentValues.flag : "Alpha"
    }
  },

  submit: function () {
    this.props.submit({
      name: this.state.name,
      questions: this.state.selectedQuestions,
      introURL: this.state.introURL,
      flag: this.state.flag
    })
  },

  handleStateChange: function (key, event) {
    var changes = {};
    changes[key] = event.target.value;
    this.setState(changes)
  },

  handleChange: function (value) {
    const currentSelectedQuestions = this.state.selectedQuestions;
    var newSelectedQuestions;
    if (_.indexOf(currentSelectedQuestions, value) === -1) {
      if(currentSelectedQuestions===undefined) {
        newSelectedQuestions = [value]
      } else {
        newSelectedQuestions = currentSelectedQuestions.concat([value]);
      }
    } else {
      newSelectedQuestions = _.without(currentSelectedQuestions, value)
    }
    this.setState({selectedQuestions: newSelectedQuestions})
  },

  handleSearchChange: function(e) {
    this.handleChange(e.value)
  },

  dragStart: function(e) {
    console.log(e)
  },

  dragEnd: function(e) {
    console.log(e)
  },

  renderQuestionSelect: function () {
    if(this.state.selectedQuestions) {
      return this.state.selectedQuestions.map((key) => {
        return (
          <p key={key}>
            {this.props.questions.data[key].prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}
          </p>
        )
      })
    } else {
      return (<div>No questions</div>)
    }
    // const formattedQuestions = hashToCollection(this.props.questions.data).map((question) => {
    //   return {
    //     value: question.key,
    //     title: question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
    //   }
    // })
    // const allUnchecked = this.state.selectedQuestions ? false : true
    // return formattedQuestions.map((question) => {
    //   return (
    //     <p key={question.value} className="control">
    //       <label className="checkbox">
    //         <input
    //         type="checkbox"
    //         onChange={this.handleChange.bind(null, question.value)}
    //         checked={(allUnchecked ? false : this.state.selectedQuestions.indexOf(question.value) !== -1)}/>
    //         {question.title}
    //       </label>
    //     </p>
    //   )
    // })
  },

  renderSearchBox: function() {
    const options = hashToCollection(this.props.questions.data)
    if (options.length > 0) {
      const formatted = options.map((opt) => {
        return {name: opt.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, ""), value: opt.key}
      })
      const searchBox = (<QuestionSelector options={formatted} placeholder="Search for a question"
                          onChange={this.handleSearchChange} />)
      return searchBox
    }

  },

  handleSelect: function(e) {
    this.setState({flag: e.target.value})
  },

  render: function () {
    return (
    <div className="box">
      <h4 className="title">Add New Lesson</h4>
      <p className="control">
        <label className="label">Name</label>
        <input
          className="input"
          type="text"
          placeholder="Text input"
          value={this.state.name}
          onChange={this.handleStateChange.bind(null, "name")}
        />
      </p>
      <p className="control">
        <label className="label">Intro URL (You can link to a video or slideshow)</label>
        <input
          className="input"
          type="text"
          placeholder="http://example.com"
          value={this.state.introURL}
          onChange={this.handleStateChange.bind(null, "introURL")}
        />
      </p>
      <p className="control">
        <label className="label">Flag</label>
        <span className="select">
          <select defaultValue={this.state.flag} onChange={this.handleSelect}>
            <option value="Alpha">Alpha</option>
            <option value="Beta">Beta</option>
            <option value="Production">Production</option>
            <option value="Archive">Archive</option>
          </select>
        </span>
      </p>
      <div className="control">
        <label className="label">Currently Selected Questions</label>
        {this.renderQuestionSelect()}
      </div>
      <p className="label">All Questions</p>
      {this.renderSearchBox()}
      <br />
      <p className="control">
        <button className={"button is-primary " + this.props.stateSpecificClass} onClick={this.submit}>Submit</button>
      </p>
    </div>
    )
  }
})

function select(state) {
  return {
    questions: state.questions
  }
}

export default connect(select)(LessonForm)
