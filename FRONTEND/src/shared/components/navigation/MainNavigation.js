import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import { useState } from "react";
import Backdrop from "./Backdrop";

const MainNavigation = (props) => {
  const [isDrawer, setIsDrawer] = useState(false);

  const openDrawerHandler = () => {
    setIsDrawer(true);
  };

  const closeDrawerHandler = () => {
    setIsDrawer(false);
  };

  return (
    <Fragment>
      {isDrawer && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={isDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </Fragment>
  );
};
export default MainNavigation;
