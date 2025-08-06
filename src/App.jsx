import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ListingDetail from './pages/ListingDetail';
import Inquiry from './pages/Inquiry';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home/>}/>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/listing/:id" element={<ListingDetail/>}/>
          <Route path="/inquiry/:id" element={<Inquiry/>}/>
          <Route path="/payment/:id" element={<Payment/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/profile" element={<Dashboard/>}/>
          <Route path="/admin" element={<AdminPanel/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
