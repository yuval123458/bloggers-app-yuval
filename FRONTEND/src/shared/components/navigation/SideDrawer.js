import React from "react";
import reactDom from "react-dom";
import "./SideDrawer.css";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
  const drawer = (
    <CSSTransition
      in={props.show}
      timeout={1000}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer">{props.children}</aside>
    </CSSTransition>
  );
  return reactDom.createPortal(drawer, document.getElementById("drawer-hook"));
};
export default SideDrawer;
