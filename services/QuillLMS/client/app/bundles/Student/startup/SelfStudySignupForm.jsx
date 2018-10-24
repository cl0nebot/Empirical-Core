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
      over13: false
    }
    this.under13Fields = [
      {
          name: 'email',
          label: 'Email for parent or gaurdian',
          errorLabel: 'Email for parent or gaurdian'
      }
    ];
    this.over13Fields = [
      {
          name: 'email',
          label: 'Personal Email',
          errorLabel: 'Personal Email'
      }
    ];
    this.updateOver13 = this.updateOver13.bind(this);
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
    alert('gon post');
    $.ajax({
      type: 'POST',
      dataType: "json",
      url: '/account/send_verification_email',
      data: {
        email: this.state.email,
        over13: this.state.over13
      },
      success: this.uponSelfStudySignup,
      error: this.selfStudySignupError
    });
    alert('done ajaxed');
  }

  errorMessage() {
    if (this.state.error !== null) {
      return <div><span className='error-message'>{this.state.error}</span></div>;
    }
  }
  
  conditionalFields() {
    const that = this
    if (this.state.over13) {
      return this.over13Fields.map(function(field) {
        const type = field.name === 'password' ? 'password' : 'text'
        const error = that.state.errors[field.name]
          ? <div className="error">{field.errorLabel} {that.state.errors[field.name]}.</div>
          : <span />
        return <div className="text-input-row" key={field.name}>
          <div className="form-label">{field.label}</div>
          <input id={field.name} placeholder={field.label} type={type} onChange={that.update}/>
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
          <input id={field.name} placeholder={field.label} type={type} onChange={that.update}/>
          {error}
        </div>
        }
      )
    }
  }

  updateOver13(event) {
    this.updateKeyValue('over13', event.target.checked);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  render() {
    return (
      <div className="add-additional-class">
        <h3 className='sign-up-header'>Sign up for Self Study</h3>
        <div className='need-a-border'/>
        {this.conditionalFields()}
        <input type='checkbox' name='over13' ref='over13' onChange={this.updateOver13} checked={this.state.over13}/>
        <p>I am over the age of 13.</p>
        <button className='sign-up-button button-green' onClick={this.selfStudySignup}>Sign Up</button>
        {this.errorMessage()}
      </div>
    );
  }

}
export default SelfStudySignupForm
