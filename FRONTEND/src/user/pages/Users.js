import React, { Fragment } from "react";
import { useEffect } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import { useState } from "react";
import useHttp from "../../shared/hooks/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const [users, setUsers] = useState();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setUsers(response.users);
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  );
};
export default Users;
