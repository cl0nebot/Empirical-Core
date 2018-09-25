import React, { Component } from 'react'
import RoleOption from './role_option'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

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


const Teacher = () => (
  <div>
    <h2>Teacher</h2>
  </div>
)
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

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <!-- acount/new should be /sign-up/type -->
          <Route exact path="/account/new" component={Type}/>
          <Route path="/sign-up/teacher" component={Teacher}/>
          <Route path="/sign-up/student" component={Student}/>

          <Route path="/sign-up/teacher/add-school" component={Topics}/>
        </div>
      </Router>
    )
  }
}

export default App
