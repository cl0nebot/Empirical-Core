import React from 'react'

export interface DiagnosticProps {
  completedDiagnostic: boolean
  recommendations: number[]
}

class Diagnostic extends React.Component<DiagnosticProps, any> {
  render() {
    return (
      <div style={styles.card}>
        <h3>Diagnostic {this.props.completedDiagnostic ? "Complete" : "Incomplete"}</h3>
        <hr/>
        <p>You completed the diagnostic and have been recommended {this.props.recommendations.length} activities.</p>
      </div>
    )
  }
}

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e7e7e7',
    padding: 15
  }
}

export default Diagnostic