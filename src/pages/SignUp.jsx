import React from 'react'
import { Navbar } from 'react-bootstrap'
import { Link } from 'react-router'
import Model from "../assets/Model.png";

const SignUp = () => {
  return (
    <div>
        <Navbar/>
        <div className="d-flex  vh-70"></div>
        <div
                className="w-50 d-flex flex-column content-center align-items-center text-white">
                <img src={Model} alt="man in apron"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center-image",
                  marginBottom: "20px"
                }}
              />
                <div className="position-absolute bottom-0 text-white p-4" style={{ background: 'grey',width: '50%' }}>
                  <h3>No Hazzles</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                </div>
              </div>
              <div className='container'>
 <div className="w-50 d-flex justify-content-center align-items-center bg-light">
        <div className="w-75">
          <h4 className="mb-3">Create your free account</h4>
          <p>
            Already registered? <a href="#">Sign in</a>
          </p>
          <form>
            <div className="row">
              <div className="mb-3 col">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" placeholder="Joshua" />
              </div>
              <div className="mb-3 col">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" placeholder="Bakare" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="josh.bakery@gmail.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="" />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Continue
            </button>
            <p className="mt-3 text-muted small">
              By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
 </div>
  );
};



export default SignUp
