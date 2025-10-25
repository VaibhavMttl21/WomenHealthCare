import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import App from './App'
import { store } from './store/store'
import './locales/i18n'
import './index.css'

// Register Firebase service worker early
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('✅ Firebase Service Worker registered successfully:', registration);
    })
    .catch((error) => {
      console.error('❌ Firebase Service Worker registration failed:', error);
    });

  // Listen for messages from service worker (notification clicks)
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('📬 [Main] Message from service worker:', event.data);
    
    if (event.data?.type === 'NOTIFICATION_CLICK') {
      const url = event.data.url;
      if (url && url !== '/') {
        // Use window.location to navigate
        window.location.href = url;
      }
    }
  });
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (replaces cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                style: {
                  background: '#059669',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#059669',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#dc2626',
                },
              },
            }}
          />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
