import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Sidebar from "./components/Sidebar";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignUp/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
