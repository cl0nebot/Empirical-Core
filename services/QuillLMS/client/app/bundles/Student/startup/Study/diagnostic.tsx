import React from 'react'

export interface DiagnosticProps {
  completedDiagnostic: boolean
  recommendations: number[]
}

class Diagnostic extends React.Component<DiagnosticProps, any> {

  renderCardBody(completedDiagnostic:boolean): JSX.Element {
    if (completedDiagnostic) {
      return (
        <p>You completed the diagnostic and have been recommended {this.props.recommendations.length} activities.</p>
      )
    } else {
      return (
        <div>
          <p>If you take the diagnostic, you'll be recommended activities based on your performance.</p>
          <a  href="/activity_sessions/anonymous?activity_id=413" className="button">Take the diagnostic</a>
        </div>
      )
    }
  }

  render() {
    const header = this.props.completedDiagnostic ? "You've completed the diagnostic!" : "You should take the diagnostic!"

    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{header}</h3>
        <hr/>
        {this.renderCardBody(this.props.completedDiagnostic)}
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
    marginRight: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  }
}

export default Diagnostic