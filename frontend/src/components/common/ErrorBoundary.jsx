import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FiAlertTriangle, FiRotateCcw } from 'react-icons/fi';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
          <Card className="max-w-md w-full flex flex-col items-center text-center p-8 border border-red-500/30 bg-red-500/5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-3xl mb-4">
              <FiAlertTriangle />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              An unexpected interface error occurred. Don't worry—your data and active document session remain safe.
            </p>
            <Button onClick={this.handleReset} className="mt-6 flex items-center gap-2">
              <FiRotateCcw /> Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
