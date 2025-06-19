import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Context from "../components/Context";

const Home = () => {
  return (
    <div>
      <Navbar />
      
      <div className="container-fluid">
        <div className="row">
          <div className="col-auto col-md-1 bg-light min-vh-10">
            <Sidebar />
          </div>

          <div className="col">
            <Context />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
