'use strict'
import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';


class SelfStudySignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      email: null,
      age: 0
    }
    this.under13Fields = [
      {
          name: 'email',
          label: 'Email for parent or gaurdian',
          placeholder: 'mygaurdian@example.com',
          errorLabel: 'Email for parent or gaurdian'
      }
    ];
    this.over13Fields = [
      {
          name: 'email',
          label: 'Personal Email',
          placeholder: 'me@example.com',
          errorLabel: 'Personal Email'
      }
    ];
    this.uponSelfStudySignup = this.uponSelfStudySignup.bind(this);
    this.selfStudySignupError = this.selfStudySignupError.bind(this);
    this.selfStudySignup = this.selfStudySignup.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.conditionalFields = this.conditionalFields.bind(this);
  }

  updateKeyValue(key, value) {
      const newState = Object.assign({}, this.state);
      newState[key] = value;
      this.setState(newState);
  }

  uponSelfStudySignup() {
    window.location = '/profile'
  }

  selfStudySignupError() {
    this.setState({errors: 'There was an error submitting your form.'});
  }

  selfStudySignup() {
    $.ajax({
      type: 'POST',
      dataType: "json",
      url: '/account/send_verification_email',
      data: {
        email: this.state.email,
        age: this.state.age
      },
      success: this.uponSelfStudySignup,
      error: this.selfStudySignupError
    });
  }

  errorMessage() {
    if (this.state.error !== null) {
      return <div><span className='error-message'>{this.state.error}</span></div>;
    }
  }
  
  conditionalFields() {
    let styles = {
      width: '220px',
    };
    const that = this
    if (this.state.age >= 13) {
      return this.over13Fields.map(function(field) {
        const type = field.name === 'password' ? 'password' : 'text'
        const error = that.state.errors[field.name]
          ? <div className="error">{field.errorLabel} {that.state.errors[field.name]}.</div>
          : <span />
        return <div className="text-input-row" key={field.name}>
          <div className="form-label">{field.label}</div>
          <input
            style={styles}
            id={field.name} placeholder={field.placeholder} type={type} onChange={that.update}/>
          {error}
        </div>
      }
      )
    } else {
      return this.under13Fields.map(function(field) {
        const type = field.name === 'password' ? 'password' : 'text'
        const error = that.state.errors[field.name]
         ? <div className="error">{field.errorLabel} {that.state.errors[field.name]}.</div>
         : <span />
        return <div className="text-input-row" key={field.name}>
          <div className="form-label">{field.label}</div>
          <input 
            style={styles}
            id={field.name} placeholder={field.placeholder} type={type} onChange={that.update}/>
          {error}
        </div>
        }
      )
    }
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  render() {
    let styles = {
      width: '60px',
    };
    return (
      <div id='add-additional-class'>
        <div className='additional-class stage-1 text-center'>
          <h1>Sign up for Self Study</h1>
          <div className="form-label">How old are you?</div>
          <input id='age'
            type="number"
            min="1" max="123" step="1"
            style={styles}
            className='class-input'
            onChange={e => this.update(e)} placeholder='12'></input>
          <br/>
          {this.conditionalFields()}
          <button className='button-green' onClick={this.selfStudySignup}>Sign Up</button>
          <br/>
        </div>
      </div>
    );
  }

}
export default SelfStudySignupForm
