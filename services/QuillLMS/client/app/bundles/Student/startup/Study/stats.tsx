import React from 'react'

export interface StatsProps {
  numberOfCompletedActivities: number
}

class Stats extends React.Component<StatsProps, any> {
  render() {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Stats</h3>
        <hr/>
        <p>Completed activities: {this.props.numberOfCompletedActivities}</p>
      </div>
    )
  }
}

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #cecece',
    padding: 15,
    marginBottom: 40,
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  }
}

export default Stats