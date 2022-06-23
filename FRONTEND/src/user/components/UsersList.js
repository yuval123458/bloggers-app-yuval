import React from "react";
import classes from "./UsersList.module.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UI/Card";

const UsersList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <Card className="center">
        <h2>No Users Found.</h2>
      </Card>
    );
  }
  return (
    <ul className={classes.userslist}>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placesCount={user.places.length}
        />
      ))}
    </ul>
  );
};
export default UsersList;
