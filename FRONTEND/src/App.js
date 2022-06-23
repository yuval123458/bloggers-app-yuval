import React, { Suspense, Fragment, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authReducer";
import LoadingSpinner from "./shared/components/UI/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const UserAuth = React.lazy(() => import("./user/pages/UserAuth"));
// 1//036Ur16S6JtFHCgYIARAAGAMSNwF-L9IruWH_F5iS50KOiXAoZy07Q7A8EP8JmBj6mXwkUBww1WKTCKSGif4AELZMVXEEkFkBzQE
const App = () => {
  const isLog = useSelector((state) => state.auth.isLogged);
  const dispatch = useDispatch();
  let routes;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      dispatch(
        authActions.login({
          userId: storedData.userId,
          token: storedData.token,
        })
      );
    }
  }, []);

  if (isLog) {
    routes = (
      <Fragment>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/:userId/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<UserAuth />} />{" "}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Fragment>
    );
  }
  return (
    <BrowserRouter>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>{routes}</Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
