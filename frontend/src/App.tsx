import { RouterProvider } from 'react-router'
import routes from './routes/Routes'
import { ThemeProvider } from './theme/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider> 
  )
}

export default App
