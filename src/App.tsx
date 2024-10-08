import './App.css'
import { RouterProvider } from 'react-router-dom'
import { Loading } from './components/loading'
import { router } from './routes'
function App() {


  return (
    <>
        <RouterProvider router={router} fallbackElement={<Loading />} />
    </>
  )
}

export default App
