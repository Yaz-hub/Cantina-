import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/recipes" className="navbar-brand">
          Cantina
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/recipes"} className="nav-link">
              Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>
    );
}

export { Navigation }; 