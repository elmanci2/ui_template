import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Routes} from './src/routes';
import {hugeiconsLicense} from '@hugeicons/react-native-pro';
import {Provider} from 'react-redux';
import store from './src/storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      suspense: true,
      cacheTime: 1000 * 60 * 60 * 24 * 30, //?<== un mes
    },
  },
});

const App = () => {
  hugeiconsLicense('no_key');

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
