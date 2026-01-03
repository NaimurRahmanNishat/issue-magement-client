// frontend/src/main.tsx

import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './redux/store.ts'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}> 
    <RouterProvider router={router} />
  </Provider>,
)
