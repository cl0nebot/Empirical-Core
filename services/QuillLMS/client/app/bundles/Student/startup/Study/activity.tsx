import React from 'react'
import { ActivityScore, Activity } from '.';
import ActivityIconWithTooltip from '../../../Teacher/components/general_components/activity_icon_with_tooltip'

function getScoreForActivity(scores: ActivityScore[], activity: Activity): number | null {
  const checkedScore: ActivityScore | undefined = scores.find(score => score.activityId == activity.id);
  return checkedScore ? checkedScore.percentage : null
}

function renderScore(score: number|null): string|undefined {
  return score ? `SCORE: ${Math.round(score * 100)}%`: undefined;
}

declare interface ActivityRowProps {
  activity: Activity
  scores: ActivityScore[]
}

export default ({activity, scores}: ActivityRowProps) => {
  const percentage = getScoreForActivity(scores, activity);
  const activity_classification_id = activity.activityClassificationId;
  return (
    <div className='line'>
      <div className="row-list-beginning pull-left">
        <ActivityIconWithTooltip data={{percentage, activity_classification_id}}/>
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

}