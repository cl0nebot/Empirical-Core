import React from 'react'

export interface DiagnosticProps {
  completedDiagnostic: boolean
  recommendations: number[]
  toggleFilterRecommendations(): void
  filterRecommendations: boolean
}

class Diagnostic extends React.Component<DiagnosticProps, any> {

  renderCardBody(completedDiagnostic:boolean): JSX.Element {
    if (completedDiagnostic) {
      return (
        <div>
          <p>You completed the diagnostic and have been recommended {this.props.recommendations.length} activities.</p>
          <button style={styles.cardButton} onClick={this.props.toggleFilterRecommendations}>{this.props.filterRecommendations ? "Show All Activities" : "Show My Recommendations"}</button>
        </div>
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
    const header = this.props.completedDiagnostic ? "You've Completed The Diagnostic!" : "You Should Take The Diagnostic!"

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
  },
  cardButton: {
    width: '100%',
    marginTop: 9,
    backgroundColor: "#fff",
    border: "1px solid #737373",
    color: '#333333',
  }
}

export default Diagnostic