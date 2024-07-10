//import Link from react router dom
import { Link } from "react-router-dom";
import { useState } from 'react';

//import routes
import Routes from './routers';
import Navbar from "./container/navbar";
import Footer from "./container/footer";

export default function App() {
  const menuArray = [
    {
      "sequence": 1,
      "color": "00aa00",
      "name": "Home",
      "icon": "bi-house-door",
      "path": "/home"
    },
    {
      "sequence": 10,
      "color": "D43F3A",
      "name": "Master",
      "icon": "bi-files",
      "children": [
        {
          "sequence": 1,
          "color": "null",
          "name": "Zone",
          "icon": "bi-pin-map",
          "path": "/master/zone"
        }
      ]
    },
    {
      "sequence": 25,
      "color": "08b5fb",
      "name": "External",
      "icon": "bi-arrow-90deg-right",
      "children": [
        {
          "sequence": 1,
          "color": "E7E7E7",
          "name": "Server",
          "icon": "bi-hdd-rack",
          "path": "/external-data/server"
        },
        {
          "sequence": 2,
          "color": "E7E7E7",
          "name": "Database",
          "icon": "bi-database",
          "path": "/external-data/database"
        },
        {
          "sequence": 3,
          "color": "E7E7E7",
          "name": "API",
          "icon": "bi-plugin",
          "path": "/external-data/api"
        }
      ]
    },
    {
      "sequence": 30,
      "color": "ffc40d",
      "name": "Command",
      "icon": "bi-shield-lock",
      "children": [
        {
          "sequence": 1,
          "color": "E7E7E7",
          "name": "Monitoring",
          "icon": "bi-laptop",
          "path": "/command/monitoring"
        },
        {
          "sequence": 2,
          "color": "E7E7E7",
          "children": [
            {
              "sequence": 1,
              "color": "E7E7E7",
              "name": "Menu",
              "icon": "bi-diagram-3",
              "path": "/command/menu"
            },
            {
              "sequence": 2,
              "color": "E7E7E7",
              "name": "Role",
              "icon": "bi-file-ruled",
              "path": "/command/role"
            },
            {
              "sequence": 3,
              "color": "E7E7E7",
              "name": "User",
              "icon": "bi-person",
              "path": "/command/user"
            }
          ],
          "name": "Access",
          "icon": "bi-lock",
          "path": "/command/access"
        },
        {
          "sequence": 3,
          "color": "E7E7E7",
          "name": "Configuration",
          "icon": "bi-gear",
          "children": [
            {
              "sequence": 1,
              "color": "E7E7E7",
              "name": "Properties",
              "icon": "bi-file-text",
              "path": "/command/properties"
            },
            {
              "sequence": 2,
              "color": "null",
              "name": "Language",
              "icon": "bi-translate",
              "path": "/command/language"
            },
            {
              "sequence": 3,
              "color": "null",
              "name": "Procedure",
              "icon": "bi-arrow-right",
              "path": "/command/procedure"
            },
            {
              "sequence": 4,
              "color": "E7E7E7",
              "name": "Email Scheduler",
              "icon": "bi-envelope",
              "path": "/command/email-scheduler"
            }
          ]
        }
      ],
    },
    {
      "sequence": 99,
      "color": "E7E7E7",
      "name": "Example",
      "icon": "bi-puzzle",
      "path": "/test/example-template"
    }
  ];
  return (
    <div>
      <Navbar data={menuArray} />
      <Routes />
      <Footer />
    </div>
  )
}