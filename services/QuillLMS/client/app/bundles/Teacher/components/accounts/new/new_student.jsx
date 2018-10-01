'use strict';
import React from 'react'
import AuthSignUp from './auth_sign_up'
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom'

export default React.createClass({
  propTypes: {
    errors: React.PropTypes.object
  },

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
      name: 'username',
      label: 'Username',
      errorLabel: 'Username'
    },
    {
      name: 'email',
      label: 'Email (optional)',
      errorLabel: 'Email'
    },
    {
      name: 'password',
      label: 'Password',
      errorLabel: 'Password'
    }
  ],
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

  uponSignUp: function() {
    alert('in new_student.jsx uponSignUp');
    window.location = '/add_classroom';
  },

  signUpError: function (xhr) {
    alert('in new_student.jsx signUpErrosignUpError');
    var errors = $.parseJSON(xhr.responseText).errors;
    this.setState({errors: errors});
  },

  signUpData: function () {
    const name = this.state.first_name + ' ' + this.state.last_name
    const data = {
      role: 'student',
      name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    return {user: data};
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

  update: function(e) {
    //this.props.updateKeyValue(e.target.id, e.target.value)
    this.updateKeyValue(e.target.id, e.target.value)
  },

  updateKeyValue: function (key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  },

  render: function () {
    return (
      <div className="new-student-account">
        <div className='text-center'>
          <div>
            <h3 className='sign-up-header'>Sign up for a Student Account</h3>
            <p className='text-center support-p'>We now support Google Classroom!</p>
            <AuthSignUp />
          </div>
        </div>
        <div className='need-a-border'/>
        {this.inputs()}
        <Link onClick={this.signUp} to="#">
          <button className='button-green sign-up-button'>
            Sign Up
          </button>
        </Link>
        <div className='text-align-center'>By signing up, you agree to our<a href='/tos' target='_blank'> terms of service </a> and <a href='/privacy' target='_blank'> privacy policy</a>.</div>
    </div>
    );
  }
});
