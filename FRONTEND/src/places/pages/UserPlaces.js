import React from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import useHttp from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const { userId } = useParams();
  const [userPlaces, setUserPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();
  console.log(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setUserPlaces(response.places);
      } catch (err) {}
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const deleteHandler = (id) => {
    setUserPlaces((prevPlaces) => {
      return prevPlaces.filter((p) => p.id !== id);
    });
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList onDelete={deleteHandler} places={userPlaces} />
      )}
    </Fragment>
  );
};
export default UserPlaces;
