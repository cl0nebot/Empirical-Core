import React from 'react';
import { ActivityCategory, Activity, ActivityOrder, ActivityScore } from '.';
import Category from './category'
export interface ActivitiesProps {
  activities: ActivityCategory[];
  recommendations: number[];
  scores: ActivityScore[];
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
      if (category.activities.length == 0) {
        return
      }
      return <Category category={category} scores={this.props.scores} recommendations={this.props.recommendations}/>
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