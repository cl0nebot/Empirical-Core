import React from 'react';
import { ActivityCategory, Activity } from '.';

export interface ActivitiesProps {
  activities: any[]
  recommendations: any
  scores: any
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
    return activities.map((activity) => {
      return (
        <div className='line' key={activity.id}>
          <div className="row-list-beginning pull-left">
            <div className="activate-tooltip icon-link icon-wrapper icon-green icon-diagnostic"></div>
            <div className="icons-description-wrapper">
              <p className="title title-v-centered">{activity.name}</p>
            </div>
          </div>
          <div className="row-list-end">
            <span></span>
            <p className="title-v-centered text-right">Play</p>
          </div>
        </div>
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