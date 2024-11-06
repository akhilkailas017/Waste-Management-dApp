
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CreateWaste from './pages/CreateWaste'
import ReadWaste from './pages/ReadWaste'
import DeleteWaste from './pages/DeleteWaste'
import WasteCollectionDashboard from './pages/WasteCollectionDashboard'
import RecyclingCenterDashboard from './pages/RecyclingCenterDashboard'
import GovernmentDashboard from './pages/GovernmentDashboard'
import ManufacturerDashboard from './pages/ManufacturerDashboard'
import QueryAllWaste from './pages/QueryAllWaste'
import UpdateWasteDetails from './pages/UpdateWasteDetails'
import BuyWaste from './pages/BuyWaste'
import CreateProduct from './pages/CreateProduct'
import ReadProduct from './pages/ReadProduct'
import DeleteProduct from './pages/DeleteProduct'
import QueryAllProduct from './pages/QueryAllProduct'
import CreateVoucher from './pages/CreateVoucher'
import UseVoucher from './pages/UseVoucher'
import ReadVoucher from './pages/ReadVoucher'
import DeleteVoucher from './pages/DeleteVoucher'


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
    <Route path='/' element={<Homepage/>}/>
    <Route path='/createWaste' element={<CreateWaste/>}/>
    <Route path='/readWaste' element={<ReadWaste/>}/>
    <Route path='/deleteWaste' element={<DeleteWaste/>}/>
    <Route path='/CollectionDashboard' element={<WasteCollectionDashboard/>}/>
    <Route path='/recyclingCenterDashboard' element={<RecyclingCenterDashboard/>}/>
    <Route path='/governmentDashboard' element={<GovernmentDashboard/>}/>
    <Route path='/manufacturerDashboard' element={<ManufacturerDashboard/>}/>
    <Route path='/queryWaste' element={<QueryAllWaste/>}/>
    <Route path='/updateWaste' element={<UpdateWasteDetails/>}/>
    <Route path='/buyWaste' element={<BuyWaste/>}/>
    <Route path='/createProduct' element={<CreateProduct/>}/>
    <Route path='/readProduct' element={<ReadProduct/>}/>
    <Route path='/deleteProduct' element={<DeleteProduct/>}/>
    <Route path='/queryProduct' element={<QueryAllProduct/>}/>
    <Route path='/createVoucher' element={<CreateVoucher/>}/>
    <Route path='/useVoucher' element={<UseVoucher/>}/>
    <Route path='/readVoucher' element={<ReadVoucher/>}/>
    <Route path='/deleteVoucher' element={<DeleteVoucher/>}/>
    </>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App