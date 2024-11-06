
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CreateWaste from './pages/CreateWaste'
import ReadWaste from './pages/ReadWaste'


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
    <Route path='/' element={<Homepage/>}/>
    <Route path='/createWaste' element={<CreateWaste/>}/>
    <Route path='/readWaste' element={<ReadWaste/>}/>
    </>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App