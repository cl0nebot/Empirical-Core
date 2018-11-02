import React from 'react';
import { ActivityCategory, Activity, ActivityOrder, ActivityScore } from '.';
import ActivityRow from './activity';
export interface ActivitiesProps {
  activities: ActivityCategory[];
  recommendations: number[];
  scores: ActivityScore[];
}

class Activities extends React.Component<ActivitiesProps, any> {
  constructor(props: ActivitiesProps) {
    super(props);
  }

  renderCategories(categories: ActivityCategory[]) {
    const sortedCategories = categories.slice().sort(function(a,b){
      return a.orderNumber - b.orderNumber
    })
    return sortedCategories.map((category) => {
      if (category.activities.length == 0) {
        return
      }
      return (
        <div className="fake-table" key={category.id}>
          <div className="header">
            <span className="header-text">{category.name}</span>
            <span className="header-list">
              <span></span>
              <span className="header-list-counter">
                {category.activities.length}
              </span>
            </span>
          </div>
         
          {this.renderActivities(category.activities, category.activityOrders)}
          
        </div>
      )
    })
  }

  renderActivities(activities: Activity[], activityOrders: ActivityOrder[]) { 
    const sortedActivities = activities.slice().sort(function(a, b){
      const a_order_number = activityOrders.find((order) => order.activityId == a.id).orderNumber;
      const b_order_number = activityOrders.find((order) => order.activityId == b.id).orderNumber;
      return a_order_number - b_order_number;
    })
    
    return activities.map((activity) => {
      return (
        <ActivityRow activity={activity}, scores={this.props.scores} key={activity.id} />
      )
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