import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    // Also log to console for developer
    console.error('ErrorBoundary caught', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <div className="admin-card" style={{ border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.04)', color: '#ef4444' }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Đã có lỗi xảy ra</h3>
            <div style={{ fontSize: 13, marginBottom: 12 }}>{String(this.state.error?.message || this.state.error)}</div>
            <details style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>
              {this.state.info?.componentStack || ''}
            </details>
            <div>
              <button className="admin-btn admin-btn-ghost" onClick={this.handleReset}>Thử lại</button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
