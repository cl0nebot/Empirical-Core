import AnalyticsWrapper from '../../shared/analytics_wrapper'
import EducatorType from './educator_type'
import React, { Component } from 'react'
import AuthSignUp from './auth_sign_up'
import RoleOption from './role_option'
import UsK12View from '../school/us_k12_view'
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom'



const BasicTeacherInfo =  React.createClass({
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
        return (
            <div className="new-teacher-account">
              <h3 className='sign-up-header'>Sign up for a Teacher Account</h3>
              <p className='support-p text-center'>We now support Google Classroom!</p>
              <AuthSignUp/>
              <div className='need-a-border'/>
              {this.inputs()}
              <input type='checkbox' name='sendNewsletter' ref='sendNewsletter' onChange={this.updateSendNewsletter} checked={this.props.sendNewsletter}/>
              <p>Send me monthly Quill updates</p>
              <Link onClick={this.signUp} to="/sign-up/pick-school-type">
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


const Type = () => (
  <div className='container account-form' id='sign-up'>
    <div className='row sign_up_select_role'>
        <div className='row'>
          <h3 className='col-xs-12'>
            Sign up for Quill as:
          </h3>
        </div>
        <div className='option-wrapper'>
          <Link to="/sign-up/teacher">
            <button className='button-green'>
              Educator
            </button>
          </Link>
          <Link to="/sign-up/student">
            <button className='button-green'>
              Student
            </button>
          </Link>
        </div>
        <div className='row'>
          <div className='col-xs-12'>Already signed up? <a href='/session/new'>Return to Login</a></div>
        </div>
    </div>
  </div>
)


const Teacher = React.createClass({
  render() {
    return (
      <BasicTeacherInfo signUp={this.props.signUp} updateKeyValue={this.props.updateKeyValue} sendNewsletter={this.props.sendNewsletter} />
    );
  }
});

const Student = () => (
  <div>
    <h2>Student</h2>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const PickSchoolType = () => (
  <div className='educator-type'>
    <h3>Are you a faculty member at a U.S. K-12 school?*</h3>
     <div className='option-wrapper'>
      <Link to="/sign-up/add-k12">
        <button className='button-green'>
          Yes
        </button>
      </Link>
      <Link to="/sign-up/teacher/add-non-k12">
        <button className='button-green'>
          No
        </button>
      </Link>
     </div>
     <div>
       *K-12 is a term for school grades prior to college.<br/>
       These grades span from kindergarten through the 12th grade.
     </div>
  </div>
)


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/account/new" component={Type}/>
          <Route path="/sign-up/teacher" component={Teacher}/>
          <Route path="/sign-up/student" component={Student}/>
          <Route path="/sign-up/pick-school-type" component={PickSchoolType}/>
          <Route path="/sign-up/add-k12" component={UsK12View}/>
        </div>
      </Router>
    )
  }
}

export default App
