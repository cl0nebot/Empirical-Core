import React from 'react'
import { ActivityScore, Activity } from '.';
import ActivityIconWithTooltip from '../../../Teacher/components/general_components/activity_icon_with_tooltip'
import { relative } from 'path';

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
  recommendations: number[]
}

function checkRecommended(recommendations: number[], activityId: string): boolean {
  return recommendations.indexOf(parseInt(activityId)) != -1
}

function renderRecommendedBadge(recommendations: number[], activityId: string) {
  if (checkRecommended(recommendations, activityId)) {
    return (
      <div style={styles.recommendedBadge}><i className="fa fa-star"></i></div>
    )
  }
} 

export default ({activity, scores, recommendations}: ActivityRowProps) => {
  const percentage = getScoreForActivity(scores, activity);
  const activity_classification_id = activity.activityClassificationId;
  return (
    <div className='line'>
      <div className="row-list-beginning pull-left">
        <div style={styles.recommendedContainer}>
          {renderRecommendedBadge(recommendations, activity.id)}
          <ActivityIconWithTooltip data={{percentage, activity_classification_id}}/>
        </div>
        
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

const styles = {
  recommendedContainer: {
    position: "relative",
  },
  recommendedBadge: {
    position: "absolute",
    left: -8,
    border: "1px solid #eda41b",
    borderRadius: 11,
    zIndex: 10,
    backgroundColor: "#f1f1f1",
    padding: 2,
    color: "#eda41b",
    boxShadow: "0 1px 5px rgba(255, 255, 255, 0.15)"
  }
}