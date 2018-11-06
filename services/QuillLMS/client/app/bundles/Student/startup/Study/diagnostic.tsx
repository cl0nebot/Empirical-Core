import React from 'react'

export interface DiagnosticProps {
  completedDiagnostic: boolean
  recommendations: number[]
}

class Diagnostic extends React.Component<DiagnosticProps, any> {
  render() {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Diagnostic {this.props.completedDiagnostic ? "Complete" : "Incomplete"}</h3>
        <hr/>
        <p>You completed the diagnostic and have been recommended {this.props.recommendations.length} activities.</p>
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
    flexGrow: '1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  }
}

export default Diagnostic