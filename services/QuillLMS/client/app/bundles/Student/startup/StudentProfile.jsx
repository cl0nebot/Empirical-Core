import React from 'react';
import { Query, } from 'react-apollo';
import gql from 'graphql-tag';
import NextActivity from './components/next_activity.jsx';
import NotificationFeed from './components/notification_feed';
import StudentProfileUnits from './components/student_profile_units.jsx';
import StudentProfileHeader from './components/student_profile_header';
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

const classroomAssignmentsQuery = gql`
  query classroomAssignments($classroomId: String){
    currentUser {
      name
      classroom(id: $classroomId) {
        id
        name
        teacher
        assignments {
          name
          description
          repeatable
          activityClassificationId
          unitId
          uaId
          unitCreatedAt
          unitName
          caId
          markedComplete
          activityId
          actSeshUpdatedAt
          dueDate
          unitActivityCreatedAt
          locked
          pinned
          maxPercentage
          resumeLink
        }
      }
    }
  }
`;

class StudentProfile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClassroomTabClick = this.handleClassroomTabClick.bind(this);
    this.initializePusher = this.initializePusher.bind(this);
  }

  componentDidMount() {
    const {
      updateNumberOfClassroomTabs,
      fetchNotifications,
      fetchStudentProfile,
      fetchStudentsClassrooms,
      classroomId,
    } = this.props;

    if (classroomId) {
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
      fetchStudentsClassrooms();
    } else {
      fetchStudentProfile();
      fetchStudentsClassrooms();
    }

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
    const { loading, handleClassroomClick, fetchStudentProfile, history, } = this.props;

    if (!loading) {
      const newUrl = `/classrooms/${classroomId}`;
      this.props.router.push(newUrl);
      handleClassroomClick(classroomId);
      fetchStudentProfile(classroomId);
    }
  }

  initializePusher() {
    const { student, fetchStudentProfile, } = this.props;

    if (student) {
      const classroomId = student.classroom.id;

      if (process.env.RAILS_ENV === 'development') {
        Pusher.logToConsole = true;
      }
      const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
      const channel = pusher.subscribe(classroomId.toString());
      channel.bind('lesson-launched', () => {
        fetchStudentProfile(classroomId);
      });
    }
  }

  render() {
    const {
      notifications,
      nextActivitySession,
      loading,
      scores,
    } = this.props;

    const nextActivity = nextActivitySession ? (<NextActivity
      loading={loading}
      hasActivities={scores.length > 0}
      name={nextActivitySession.name}
      caId={nextActivitySession.ca_id}
      activityId={nextActivitySession.activity_id}
      activityClassificationId={nextActivitySession.activity_classification_id}
      maxPercentage={nextActivitySession.max_percentage}
    />) : null;
    return (
      <Query query={classroomAssignmentsQuery} variables={{ classroomId: this.props.params.classroomId, }}>
        {({ loading, error, data, }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const student = data.currentUser;
          return (
            <div id="student-profile-assignments">
              <StudentProfileHeader
                studentName={student.name}
                classroomName={student.classroom.name}
                teacherName={student.classroom.teacher}
              />
              <NotificationFeed notifications={notifications} />
              {/* {nextActivity} */}
              <StudentProfileUnits
                data={student.classroom.assignments}
                loading={false}
              />
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
