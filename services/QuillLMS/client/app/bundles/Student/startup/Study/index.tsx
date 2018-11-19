import React from 'react';
import { ApolloProvider, Query, } from "react-apollo";
import client from '../../../../modules/apollo';
import gql from "graphql-tag";
import Activities from './activities';
import Diagnostic from './diagnostic';
import Stats from './stats';

const selfStudyQuery = `
  {
    currentUser {
      id
      name
      activityScores {
        activityId
        percentage
        inProgress
      }
      recommendedActivities
      completedDiagnostic
      numberOfCompletedActivities
      lastTimeActivityCompleted
    }

    activityCategories {
      id
      name
      orderNumber
      activities {
        id
        name
        activityClassificationId
      }
      activityOrders{
        orderNumber
        activityId
      }
    }
  }
`;

export interface Activity {
  id: string
  name: string
  activityClassificationId: number
  orderNumber: number
}

export interface ActivityOrder {
  activityId: number
  orderNumber: number
}

export interface ActivityCategory {
  id: number
  name: string
  orderNumber: number
  activities: Activity[]
  activityOrders: ActivityOrder[]
}

export interface ActivityScore {
  activityId: number
  percentage: number
  updatedAt: number
  inProgress: number
}

export interface User {
  id: number
  name: string
  activityScores: ActivityScore[]
  recommendedActivities: number[]
  completedDiagnostic: boolean
  numberOfCompletedActivities: number
  lastTimeActivityCompleted: string|null
}

export interface SelfStudyQueryResponse {
  currentUser: User
  activityCategories: ActivityCategory[]
}

export interface QueryState {
  loading: boolean
  error: boolean
  data: SelfStudyQueryResponse
}

export interface StudyProps {
}

export interface StudyState {
  filterRecommendations: boolean
}


class SelfStudyContainer extends React.Component<StudyProps, StudyState> {
  constructor(props) {
    super(props)
   
    this.state = {
      filterRecommendations: false,
    }

    this.toggleFilterRecommendations = this.toggleFilterRecommendations.bind(this);
  }

  toggleFilterRecommendations(): void {
    this.setState({
      filterRecommendations: !this.state.filterRecommendations
    })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="container">
        <Query
          query={gql(selfStudyQuery)}
        >
        {({ loading, error, data }:QueryState ) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const payload = data;
          return (
            <div style={{padding: '40 0'}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Diagnostic
                  filterRecommendations={this.state.filterRecommendations}
                  toggleFilterRecommendations={this.toggleFilterRecommendations}
                  completedDiagnostic={data.currentUser.completedDiagnostic} 
                  recommendations={data.currentUser.recommendedActivities}
                />
                <Stats 
                  numberOfCompletedActivities={data.currentUser.numberOfCompletedActivities}
                  lastTimeActivityCompleted={data.currentUser.lastTimeActivityCompleted} 
                />
              </div>
              <Activities 
                activities={data.activityCategories} 
                scores={data.currentUser.activityScores}
                recommendations={data.currentUser.recommendedActivities}
                filterRecommendations={this.state.filterRecommendations}
                openCategories={this.state.openCategories}
              />
            </div>
          )
        }}
          </Query>
        </div>
      </ApolloProvider>
    );
  };

}

export default SelfStudyContainer
