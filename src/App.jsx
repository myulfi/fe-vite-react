//import Link from react router dom
import { Link } from "react-router-dom";
import { useState } from 'react';

//import routes
import Routes from './routers';
import Navbar from "./container/navbar";
import Footer from "./container/footer";

export default function App() {
  const [menuArray, setMenuArray] = useState([
    {
      "sequence": 1,
      "color": "00aa00",
      "name": "Home",
      "icon": "bi-home",
      "path": "/home"
    },
    {
      "sequence": 10,
      "color": "D43F3A",
      "name": "Master",
      "icon": "bi-book",
      "children": [
        {
          "sequence": 1,
          "color": "null",
          "name": "Zone",
          "icon": "bi-globe",
          "path": "/zone"
        }
      ]
    },
    {
      "sequence": 25,
      "color": "08b5fb",
      "name": "External Data",
      "icon": "bi-external-link",
      "children": [
        {
          "sequence": 1,
          "color": "E7E7E7",
          "name": "Server",
          "icon": "bi-tasks",
          "path": "/server"
        },
        {
          "sequence": 2,
          "color": "E7E7E7",
          "name": "Database",
          "icon": "bi-database",
          "path": "/database"
        },
        {
          "sequence": 3,
          "color": "E7E7E7",
          "name": "API",
          "icon": "fa-exchange",
          "path": "/api"
        }
      ]
    },
    {
      "sequence": 30,
      "color": "ffc40d",
      "name": "System Center",
      "icon": "bi-key",
      "children": [
        {
          "sequence": 1,
          "color": "E7E7E7",
          "name": "Monitoring",
          "icon": "bi-laptop",
          "path": "/monitoring"
        },
        {
          "sequence": 2,
          "color": "E7E7E7",
          "children": [
            {
              "sequence": 1,
              "color": "E7E7E7",
              "name": "Menu",
              "icon": "bi-sitemap",
              "path": "/menu"
            },
            {
              "sequence": 2,
              "color": "E7E7E7",
              "name": "Role",
              "icon": "bi-file-text-o",
              "path": "/role"
            },
            {
              "sequence": 3,
              "color": "E7E7E7",
              "name": "User",
              "icon": "fa-user",
              "path": "/user"
            }
          ],
          "name": "Access",
          "icon": "fa-lock",
          "path": "/access"
        },
        {
          "sequence": 3,
          "color": "E7E7E7",
          "name": "Configuration",
          "icon": "fa-gears",
          "children": [
            {
              "sequence": 1,
              "color": "E7E7E7",
              "name": "Properties",
              "icon": "bi-file-text",
              "path": "/properties"
            },
            {
              "sequence": 2,
              "color": "null",
              "name": "Language",
              "icon": "bi-language",
              "path": "/language"
            },
            {
              "sequence": 3,
              "color": "null",
              "name": "Procedure",
              "icon": "bi-arrow-right",
              "path": "/procedure"
            },
            {
              "sequence": 4,
              "color": "E7E7E7",
              "name": "Email Scheduler",
              "icon": "bi-envelope",
              "path": "/email-scheduler"
            }
          ]
        }
      ],
    },
    {
      "sequence": 99,
      "color": "E7E7E7",
      "name": "Example Template",
      "icon": "bi-puzzle-piece",
      "path": "/example-template"
    }
  ]);
  return (
    <>
      <div>
        {/* <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
          <div className="container">
            <Link to="/" className="navbar-brand">HOME</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/posts" className="nav-link active" aria-current="page">POSTS</Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0" role="search">
                <a
                  href="https://hahahihi.com"
                  target="_blank"
                  className="btn btn-success"
                >VITE + REACT</a
                >
              </ul>
            </div>
          </div>
        </nav> */}
        <Navbar data={menuArray} />
      </div>

      <Routes />
      <Footer />
    </>
  )

}