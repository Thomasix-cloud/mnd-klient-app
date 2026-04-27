import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Send to error tracking service (e.g. Sentry)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-[#F5F5F5] px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-xl font-bold text-[#1B1B1B] text-center mb-2">
            Něco se pokazilo
          </Text>
          <Text className="text-sm text-[#6B7280] text-center mb-6">
            Omlouváme se za nepříjemnosti. Zkuste to prosím znovu.
          </Text>
          <TouchableOpacity
            className="bg-[#00A651] rounded-xl py-3 px-8"
            onPress={this.handleReset}
          >
            <Text className="text-white font-semibold">Zkusit znovu</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
