import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Sidebar() {
    return (
        <div className="container-fluid fs-2 mb-2">
            <div className="row">
                <div class="bg-light col-auto col-md-1 min-vh-100">
                   <a className="text-decoration-none d-flex align-items-center">
                   </a>
                   <ul class="nav nav-pills flex-column">
                    <li class="nav-item fs-4 mb-4">
                        <a href="grid" class="nav-link" aria-current="page">
                         <i className="bi bi-grid"></i>
                        </a>
                    </li>
                    <li class="nav-flow fs-4 mb-4">
                        <a href="people" class="nav-link" aria-current="page">
                         <i className="bi bi-people"></i>
                        </a>
                    </li>
                    <li class="nav-card fs-4 mb-4">
                        <a href="card" class="nav-link" aria-current="page">
                         <i className="bi bi-credit-card"></i>
                        </a>
                    </li>
                   </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
