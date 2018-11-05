import React from 'react';
import { ActivityCategory, ActivityScore, ActivityOrder, Activity } from '.';
import ActivityRow from './activity';

export interface CategoryProps {
  category: ActivityCategory
  scores: ActivityScore[]
}

export interface CategoryState {
  open: boolean
}

class Category extends React.Component<CategoryProps, CategoryState> {
  constructor(props: CategoryProps) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleCategoryOpen() {
    console.log(this.state.open)
    this.setState({open: !this.state.open})
  }

  renderActivities(activities: Activity[], activityOrders: ActivityOrder[]) {
    if (!this.state.open) {return null}
    
    const sortedActivities = activities.slice().sort(function(a, b){
      const a_order_number = activityOrders.find((order) => order.activityId == a.id).orderNumber;
      const b_order_number = activityOrders.find((order) => order.activityId == b.id).orderNumber;
      return a_order_number - b_order_number;
    })
    
    return activities.map((activity) => {
      return (
        <ActivityRow activity={activity} scores={this.props.scores} key={activity.id} />
      )
    })
  }

  render () {
    const {category} = this.props
    return (
      <div className="fake-table" key={category.id}>
        <div className="header" onClick={this.toggleCategoryOpen.bind(this)}>
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
  }
}

export default Category