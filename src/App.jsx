//import Link from react router dom
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

//import routes
import Routes from './routers';
import Navbar from "./components/container/navbar";
import Footer from "./components/container/footer";
import Login from "./views/login";
import { apiRequest } from "./api";
import { METHOD_IS_GET } from "./constants/commonConstants";

export default function App() {
  const [menuList, setMenuList] = useState([]);

  const getMenu = async () => {
    if (localStorage.getItem("accessToken") !== null) {
      try {
        const response = await apiRequest(METHOD_IS_GET, "/command/menu.json")
        setMenuList(response.data.data)
      } catch (error) { }
    }
  }
  useEffect(() => { getMenu(); }, []);

  document.title = import.meta.env.VITE_APP_TITLE;
  return (
    <>
      {
        localStorage.getItem("accessToken") !== null
        && <>
          <Navbar data={menuList} />
          <Routes />
          <Footer />
        </>
      }
      {
        localStorage.getItem("accessToken") === null
        && <Login />
      }
    </>
  )
}