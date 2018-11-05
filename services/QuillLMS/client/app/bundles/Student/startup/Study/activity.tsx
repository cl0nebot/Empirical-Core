import React from 'react'
import { ActivityScore, Activity } from '.';
import ActivityIconWithTooltip from '../../../Teacher/components/general_components/activity_icon_with_tooltip'

function getScoreForActivity(scores: ActivityScore[], activity: Activity): number | null {
  const checkedScore: ActivityScore | undefined = scores.find(score => score.activityId == activity.id);
  return checkedScore ? checkedScore.percentage : null
}

function renderPlayLink(score: number|null, activityId: number): string|undefined {
  const url = `/activity_sessions/anonymous?activity_id=${activityId}`
  const copy = score ? 'Replay Activity' : 'Start Activity';
  return <a href={url}>{copy}</a>
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
        <p className="title-v-centered text-right">{renderPlayLink(percentage, activity.id)}</p>
      </div>
    </div>
  )

}