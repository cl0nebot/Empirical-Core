import React from 'react'
import { ActivityScore, Activity } from '.';

function renderScore(scores: ActivityScore[], activity: Activity) {
  const checkedScore: ActivityScore | undefined = scores.find(score => score.activityId == activity.id);
  return checkedScore ? `SCORE: ${Math.round(checkedScore.percentage * 100)}%`: undefined;
}

declare interface ActivityRowProps {
  activity: Activity
  scores: ActivityScore[]
}

export default ({activity, scores}: ActivityRowProps) => {

  return (
    <div className='line'>
      <div className="row-list-beginning pull-left">
        <div className="activate-tooltip icon-link icon-wrapper icon-green icon-diagnostic"></div>
        <div className="icons-description-wrapper">
          <p className="title title-v-centered">{activity.name} {renderScore(scores, activity)}</p>

        </div>
      </div>
      <div className="row-list-end">
        <span></span>
        <p className="title-v-centered text-right">Play</p>
      </div>
    </div>
  )

}