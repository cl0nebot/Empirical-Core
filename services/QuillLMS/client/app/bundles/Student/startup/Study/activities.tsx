import React from 'react';

export interface ActivitiesProps {
  activities: any[]
  recommendations: any
  scores: any
}

class Activities extends React.Component<ActivitiesProps, any> {
  constructor(props: ActivitiesProps) {
    super(props);
  }

  renderCategories(activities: any[]) {
    return activities.map((category) => {
      return (
        <li>
          {category.name}
        </li>
      )
    })
  }

  render() {
    return (
      <ul>
        {this.renderCategories(this.props.activities)}
      </ul>
    );
  }
}

export default Activities