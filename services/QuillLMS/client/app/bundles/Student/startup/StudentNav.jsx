import React from 'react';
import StudentsClassroomsHeader from '../../Teacher/components/student_profile/students_classrooms/students_classrooms_header.jsx';
import { Query, } from 'react-apollo';
import gql from 'graphql-tag';
import NextActivity from '../../Teacher/components/student_profile/next_activity.jsx';
import NotificationFeed from '../../Teacher/components/student_profile/notification_feed';
import StudentProfileUnits from '../../Teacher/components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../../Teacher/components/student_profile/student_profile_header';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import {
  fetchNotifications,
  fetchStudentProfile,
  fetchStudentsClassrooms,
  updateNumberOfClassroomTabs,
  handleClassroomClick,
  hideDropdown,
  toggleDropdown
} from '../../../actions/student_profile';

const classroomsQuery = `
  {
    currentUser {
      classrooms {
        id
        name
        teacher
      }
    }
  }
`;

class StudentProfile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClassroomTabClick = this.handleClassroomTabClick.bind(this);
  }

  componentDidMount() {
    const {
      updateNumberOfClassroomTabs,
      fetchNotifications,
      fetchStudentProfile,
      fetchStudentsClassrooms,
      classroomId,
    } = this.props;

    fetchStudentsClassrooms();

    // Remove following conditional when student notifications are ready to display
    const displayFeature = false;
    if (displayFeature) {
      fetchNotifications();
    }

    window.addEventListener('resize', () => {
      updateNumberOfClassroomTabs(window.innerWidth);
    });
    updateNumberOfClassroomTabs(window.innerWidth);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedClassroomId !== this.props.selectedClassroomId) {
      if (!window.location.href.includes(nextProps.selectedClassroomId)) {
        this.props.router.push(`classrooms/${nextProps.selectedClassroomId}`);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
  }

  handleClassroomTabClick(classroomId) {
    const { handleClassroomClick, fetchStudentProfile, history, } = this.props;
    const newUrl = `/classrooms/${classroomId}`;
    this.props.router.push(newUrl);
    handleClassroomClick(classroomId);
    fetchStudentProfile(classroomId);
  }

  render() {
    const {
      classrooms,
      notifications,
      numberOfClassroomTabs,
      student,
      selectedClassroomId,
      hideDropdown,
      toggleDropdown,
      showDropdown,
      nextActivitySession,
      loading,
      scores,
    } = this.props;

    return (

      <Query
        query={gql(classroomsQuery)}
      >
        {({ loading, error, data, }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const payload = data;
          return (
            <div id="student-profile">
              <StudentsClassroomsHeader
                classrooms={data.currentUser.classrooms}
                numberOfClassroomTabs={data.currentUser.classrooms.length}
                selectedClassroomId={selectedClassroomId}
                handleClick={this.handleClassroomTabClick}
                hideDropdown={hideDropdown}
                toggleDropdown={toggleDropdown}
                showDropdown={showDropdown}
              />
              {this.props.children}
            </div>
          );
        }}
      </Query>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  fetchNotifications: () => dispatch(fetchNotifications()),
  fetchStudentProfile: classroomId => dispatch(fetchStudentProfile(classroomId)),
  updateNumberOfClassroomTabs: screenWidth => dispatch(updateNumberOfClassroomTabs(screenWidth)),
  fetchStudentsClassrooms: () => dispatch(fetchStudentsClassrooms()),
  handleClassroomClick: classroomId => dispatch(handleClassroomClick(classroomId)),
  hideDropdown: () => dispatch(hideDropdown()),
  toggleDropdown: () => dispatch(toggleDropdown()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
