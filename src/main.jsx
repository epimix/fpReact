import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { LikeContextProvider } from './contexts/likeContext.jsx'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LikeContextProvider>
        <App />
      </LikeContextProvider>
    </Provider>
  </StrictMode>,
)
