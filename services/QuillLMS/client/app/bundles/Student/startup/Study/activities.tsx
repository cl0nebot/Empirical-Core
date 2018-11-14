import React from 'react';
import { ActivityCategory, Activity, ActivityOrder, ActivityScore } from '.';
import Category from './category'
export interface ActivitiesProps {
  activities: ActivityCategory[];
  recommendations: number[];
  scores: ActivityScore[];
  filterRecommendations: boolean;
  openCategories: boolean;
}

function filterActivities(activities: Activity[], recommendations: number[]):Activity[] {

  return activities.filter(activity => {
    return recommendations.indexOf(parseInt(activity.id)) != -1
  })

}

class Activities extends React.Component<ActivitiesProps, any> {
  constructor(props: ActivitiesProps) {
    super(props);
    this.state = {
      open: false
    }
  }

  renderCategories(categories: ActivityCategory[]) {
    const sortedCategories = categories.slice().sort(function(a,b){
      return a.orderNumber - b.orderNumber
    })
    return sortedCategories.map((category) => {
      // filter out activities that are not in recommendations array of filterRecommendations is true
      const activities = this.props.filterRecommendations ? filterActivities(category.activities, this.props.recommendations) : category.activities;

      if (activities.length == 0) {
        return
      }
      return <Category category={category} scores={this.props.scores} recommendations={this.props.recommendations} key={category.id} openCategories={this.props.openCategories}/>
    })
  }

  

  render() {
    return (
      <div>
        {this.renderCategories(this.props.activities)}
      </div>
    );
  }
}


export default Activities