import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  authorizationUrl: string;
  onComplete: () => void;
}

export default function PaystackCheckout({ authorizationUrl, onComplete }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: authorizationUrl }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ flex: 1 }} />}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('trxref')) {
            onComplete();
          }
        }}
      />
    </View>
  );
}