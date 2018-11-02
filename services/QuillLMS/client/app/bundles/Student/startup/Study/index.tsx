import React from 'react';
import { ApolloProvider, Query, } from "react-apollo";
import client from '../../../../modules/apollo';
import gql from "graphql-tag";
import Activities from './activities';

const selfStudyQuery = `
  {
    currentUser {
      id
      name
      activityScores {
        activityId
        percentage
        updatedAt
        inProgress
      }
      recommendedActivities
      completedDiagnostic
    }

    activityCategories {
      id
      name
      activities {
        id
        name
      }
    }
  }
`;


export interface StudyProps {
}

export default function Study() {
  return (
    <ApolloProvider client={client}>
      <div className="container">
      <Query
        query={gql(selfStudyQuery)}
      >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        const payload = data;
        return (
          <div>
            <p>{data.currentUser.name}</p>
            <Activities 
              activities={data.activityCategories} 
              scores={data.currentUser.activityScores}
              recommendations={data.currentUser.recommendedActivities}
            />
          </div>
        )
      }}
        </Query>
      </div>
    </ApolloProvider>
  );
}
