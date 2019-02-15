import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ApolloProvider, Query, } from 'react-apollo';
import client from '../../../modules/apollo';

import StudentProfile from './StudentProfile';
import StudentNav from './StudentNav';
import JoinClass from './JoinClassAppClient';
import Study from './Study/index';
import { Provider } from 'react-redux';
import studentProfile from '../../../reducers/student_profile';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(studentProfile, applyMiddleware(thunk));

const StudentProfileRouter = props => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={StudentNav}>
          <Route path="profile" component={StudentProfile} />
          <Route path="classrooms/:classroomId" component={StudentProfile} />
          <Route path="add_classroom" component={JoinClass} />
          <Route path="study" component={Study} />
        </Route>
      </Router>
    </Provider>
  </ApolloProvider>
);

export default StudentProfileRouter;
