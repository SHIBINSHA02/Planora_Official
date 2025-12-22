// frontend/src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../Components/Navigation/Navigation";
import Footer from "../Components/Footer/Footer";

const PublicLayout = () => {
  return (
    <>
      
      <Outlet />
      
    </>
  );
};

export default PublicLayout;
