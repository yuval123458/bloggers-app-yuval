import React from "react";
import "./NavLinks.css";
import { Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/authReducer";

const NavLinks = () => {
  const isLogin = useSelector((state) => state.auth.isLogged);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    return <Navigate to="/" />;
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/"> ALL USERS</NavLink>
      </li>
      {isLogin && (
        <li>
          <NavLink to={`/${userId}/places`}> MY PLACES</NavLink>
        </li>
      )}
      {isLogin && (
        <li>
          <NavLink to="/places/new"> ADD PLACE</NavLink>
        </li>
      )}
      {!isLogin && (
        <li>
          <NavLink to="/auth"> AUTHENTICATE</NavLink>
        </li>
      )}
      {isLogin && (
        <li>
          <button onClick={logoutHandler}>LOGOUT</button>)
        </li>
      )}
    </ul>
  );
};
export default NavLinks;
