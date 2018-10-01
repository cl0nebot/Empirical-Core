'use strict';
import React from 'react'
import AuthSignUp from './auth_sign_up'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom'

export default React.createClass({
    formFields: [
        {
            name: 'first_name',
            label: 'First Name',
            errorLabel: 'First name'
        },
        {
            name: 'last_name',
            label: 'Last Name',
            errorLabel: 'Last name'
        },
        {
            name: 'email',
            label: 'Email',
            errorLabel: 'Email'
        },
        {
            name: 'password',
            label: 'Password',
            errorLabel: 'Password'
        }
    ],

    uponSignUp: function (data) {
      window.location = '/sign-up/teacher/pick-school-type';
    },


    signUp: function () {
      if (this.state.first_name && this.state.last_name) {
        $.ajax({
          type: 'POST',
          url: '/account',
          data: this.signUpData(),
          success: this.uponSignUp,
          error: this.signUpError
        });
      } else {
        const errors = {}
        if (!this.state.first_name) {
          errors['first_name'] = "can't be blank"
        }
        if (!this.state.last_name) {
          errors['last_name'] = "can't be blank"
        }
        this.setState({errors})
      }
    },

    signUpError: function (xhr) {
      var errors = $.parseJSON(xhr.responseText).errors;
      this.setState({errors: errors});
    },

    signUpData: function () {
      const name = this.state.first_name + ' ' + this.state.last_name
      const data = {
        role: 'teacher',
        name,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        send_newsletter: this.state.sendNewsletter
      };
      return {user: data};
    },

    updateKeyValue: function (key, value) {
      const newState = Object.assign({}, this.state);
      newState[key] = value;
      this.setState(newState);
    },

    updateSendNewsletter: function(event) {
      this.updateKeyValue('sendNewsletter', event.target.checked);
    },

    update: function(e) {
      this.updateKeyValue(e.target.id, e.target.value)
    },

    inputs: function() {
      const that = this
      return this.formFields.map(function(field) {
        const type = field.name === 'password' ? 'password' : 'text'
        return <div className="text-input-row" key={field.name}>
          <div className="form-label">{field.label}</div>
          <input id={field.name} placeholder={field.label} type={type} onChange={that.update}/>
        </div>
      }
      )
    },

    render: function() {
        alert('Teacher/components/accounts/new/basic_teacher_info.jsx');
        return (
            <div className="new-teacher-account">
              <h3 className='sign-up-header'>Sign up for a Teacher Account</h3>
              <p className='support-p text-center'>We now support Google Classroom!</p>
              <AuthSignUp/>
              <div className='need-a-border'/>
              {this.inputs()}
              <input type='checkbox' name='sendNewsletter' ref='sendNewsletter' onChange={this.updateSendNewsletter} checked={this.props.sendNewsletter}/>
              <p>Send me monthly Quill updates</p>
              <Link to="/sign-up/teacher/pick-school-type">
                <button className='button-green sign-up-button'>
                  Sign Up
                </button>
              </Link>
              <div className='text-align-center'>
                By signing up, you agree to our <a href='/tos' target='_blank'>terms of service</a> and <a href='/privacy' target='_blank'>privacy policy</a>.
              </div>
            </div>
      );
    }
});
