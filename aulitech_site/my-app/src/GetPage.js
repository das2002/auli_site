import React from "react";
import {
  BrowserRouter as Router, Link,
  Routes, Route, Outlet
} from 'react-router-dom';
import CatoPg from "./pages/CatoPg";
import PeriPg from "./pages/PeriPg";
import HomePg from "./pages/HomePg";
import AboutPg from "./pages/AboutPg";


export default function GetPage({pageName}) {
  const pagesList = [
    {name: 'CatoPg', path: './pages/CatoPg'},
    {name: 'PeriPg', path: './pages/PeriPg'},
  ];
  return (
    <>

    </> 
  )
}