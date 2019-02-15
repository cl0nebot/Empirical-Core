import React from 'react';
import StudentProfileRouter from '../../Teacher/containers/StudentProfileRouter.jsx';
import { Provider } from 'react-redux';
import studentProfile from '../../../reducers/student_profile';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(studentProfile, applyMiddleware(thunk));

export default props => (
  <Provider store={store}>
    <StudentProfileRouter />
  </Provider>
);
