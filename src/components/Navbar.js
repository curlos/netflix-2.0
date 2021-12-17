import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent px-4 fs-6" style={{ height: '80px'}}>
      <div className="container-fluid h-100">
        <Link to="/" className="h-100 d-flex align-items-center" style={{ 'margin-right': '10px'}}>
          <img src="/assets/netflix_logo.png" alt="" className="h-50"/>
        </Link>
        <div className="collapse navbar-collapse h-100" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 h-100 list-unstyled">
            <li className="nav-item d-flex align-items-center">
              <Link to='' className="nav-link active text-white" aria-current="page" href="#">Home</Link>
            </li>

            <li className="nav-item d-flex align-items-center">
              <Link to='' className="nav-link active text-white" aria-current="page" href="#">TV Shows</Link>
            </li>

            <li className="nav-item d-flex align-items-center">
              <Link to='' className="nav-link active text-white" aria-current="page" href="#">Movies</Link>
            </li>

            <li className="nav-item d-flex align-items-center">
              <Link to='' className="nav-link active text-white" aria-current="page" href="#">New & Popular</Link>
            </li>

            <li className="nav-item d-flex align-items-center">
              <Link to='' className="nav-link active text-white" aria-current="page" href="#">My List</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center h-100">
            <form className="d-flex px-2">
              <input className="form-control me-2 bg-transparent text-white" type="search" placeholder="Search" aria-label="Search" />
              <button class="bi-search bg-transparent border-0 text-white"></button>
            </form>

            <div className="nav-item px-2">
              Kids
            </div>

            <div className="nav-item px-2">
              DVD
            </div>

            <div className="nav-item dropdown h-100">
              <div class="btn-group h-100">
                <button type="button" class="btn btn-transparent text-white d-flex align-items-center dropdown-toggle h-100" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="/assets/netflix_avatar.png" alt="" className="h-75 rounded mx-1"/>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" type="button">Action</button></li>
                  <li><button class="dropdown-item" type="button">Another action</button></li>
                  <li><button class="dropdown-item" type="button">Something else here</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
