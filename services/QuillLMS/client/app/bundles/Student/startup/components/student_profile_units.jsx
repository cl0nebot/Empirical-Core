import React from 'react';
import _ from 'underscore';
import StudentProfileUnit from './student_profile_unit.jsx';

export default React.createClass({

  groupUnits() {
    const groupedUnits = _.groupBy(this.props.data, 'unitId');
    const unitsWithGroupedActivities = {};
    for (const unit in groupedUnits) {
      const partitionedActivities = _.partition(groupedUnits[unit], activity => (activity.max_percentage != null));
      unitsWithGroupedActivities[unit] = {};
      if (partitionedActivities[0].length) {
        unitsWithGroupedActivities[unit].complete = _.sortBy(partitionedActivities[0], 'unitActivityCreatedAt');
      }
      if (partitionedActivities[1].length) {
        unitsWithGroupedActivities[unit].incomplete = partitionedActivities[1];
      }
    }
    const unitsGroupedByCompletion = _.partition(unitsWithGroupedActivities, unit => (!!unit.incomplete));
    const finalArrangement = (unitsGroupedByCompletion[0].sort((a, b) => a.incomplete[0].unitCreatedAt - b.incomplete[0].unitCreatedAt));
    return finalArrangement.concat(unitsGroupedByCompletion[1].sort((a, b) => a.complete[0].unitCreatedAt - b.complete[0].unitCreatedAt));
  },

  render() {
    let content = 'LOADING';
    if (!this.props.loading) {
      // give unit unit id key whether it is complete or incomplete
      content = this.groupUnits().map(unit => <StudentProfileUnit key={unit[Object.keys(unit)[0]][0].unitId} data={unit} />);
    }
    return (
      <div className="container">
        {content}
      </div>
    );
  },
});
