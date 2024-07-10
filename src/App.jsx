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
      "name": "External Data",
      "icon": "bi-wifi",
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
      "name": "System Center",
      "icon": "bi-key",
      "children": [
        {
          "sequence": 1,
          "color": "E7E7E7",
          "name": "Monitoring",
          "icon": "bi-laptop",
          "path": "/system-center/monitoring"
        },
        {
          "sequence": 2,
          "color": "E7E7E7",
          "children": [
            {
              "sequence": 1,
              "color": "E7E7E7",
              "name": "Menu",
              "icon": "bi-menu-button",
              "path": "/system-center/menu"
            },
            {
              "sequence": 2,
              "color": "E7E7E7",
              "name": "Role",
              "icon": "bi-file-ruled",
              "path": "/system-center/role"
            },
            {
              "sequence": 3,
              "color": "E7E7E7",
              "name": "User",
              "icon": "bi-person",
              "path": "/system-center/user"
            }
          ],
          "name": "Access",
          "icon": "bi-lock",
          "path": "/system-center/access"
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
              "path": "/system-center/properties"
            },
            {
              "sequence": 2,
              "color": "null",
              "name": "Language",
              "icon": "bi-translate",
              "path": "/system-center/language"
            },
            {
              "sequence": 3,
              "color": "null",
              "name": "Procedure",
              "icon": "bi-arrow-right",
              "path": "/system-center/procedure"
            },
            {
              "sequence": 4,
              "color": "E7E7E7",
              "name": "Email Scheduler",
              "icon": "bi-envelope",
              "path": "/system-center/email-scheduler"
            }
          ]
        }
      ],
    },
    {
      "sequence": 99,
      "color": "E7E7E7",
      "name": "Example Template",
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