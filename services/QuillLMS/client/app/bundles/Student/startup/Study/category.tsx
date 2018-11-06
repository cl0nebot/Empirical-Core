import React from 'react';
import { ActivityCategory, ActivityScore, ActivityOrder, Activity } from '.';
import ActivityRow from './activity';
import activity from './activity';

export interface CategoryProps {
  category: ActivityCategory
  scores: ActivityScore[]
  recommendations: number[]
}

export interface CategoryState {
  open: boolean
}


function numberOfCompleteActivities(scores: ActivityScore[], activities: Activity[]): number {
  return activities.map((activity) => activity.id).reduce((prev, current, i, activityIds) => {
    const score = scores.find(score => score.activityId == activityIds[i])
    return score ? prev + 1 : prev + 0
  }, 0)
}

function numberOfRecommendations(recommendations: number[], activities: Activity[]): number {
  return activities.map((activity) => activity.id).reduce((prev, current, i, activityIds) => {
    const recommended = recommendations.indexOf(parseInt(current))
    return recommended != -1 ? prev + 1 : prev + 0
  }, 0)
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
        <ActivityRow 
          activity={activity} 
          scores={this.props.scores} 
          recommendations={this.props.recommendations} 
          key={activity.id} 
        />
      )
    })
  }

  renderRecommendationsCopy(recommendations: number[], activities: Activity[]): JSX.Element|null {
    const countOfRecommendations = numberOfRecommendations(recommendations, activities)
    if (countOfRecommendations > 0) {
      return (
        <span style={styles.recommended}>{`${countOfRecommendations} Recommended Activities`} <i className="fa fa-star"></i></span>
      )
    }
  }

  render () {
    const {category, scores, recommendations} = this.props
    return (
      <div className="fake-table" key={category.id}>
        <div className="header" onClick={this.toggleCategoryOpen.bind(this)}>
          <span className="header-text">{category.name} {this.renderRecommendationsCopy(recommendations, category.activities)}</span>
          <span className="header-list">
            <span></span>
            <span className="header-list-counter">
            {numberOfCompleteActivities(scores, category.activities)} / {category.activities.length} Activities Complete
            </span>
          </span>
        </div>
       
        {this.renderActivities(category.activities, category.activityOrders)}
        
      </div>
    )
  }
}

const styles = {
  recommended: {
    border: "1px solid #eda41b",
    padding: "0 10px",
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
    color: "#eda41b",
    marginLeft: 10,
    fontWeight: 600
  }
} 

export default Category