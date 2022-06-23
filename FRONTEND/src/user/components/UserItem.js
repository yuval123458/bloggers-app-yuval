import React from "react";
import classes from "./UserItem.module.css";
import Avatar from "../../shared/components/UI/Avatar";
import Card from "../../shared/components/UI/Card";
import { Link } from "react-router-dom";

const UserItem = (props) => {
  return (
    <li className={classes.useritem}>
      <Card className={classes.useritem__content}>
        <Link to={`${props.id}/places`}>
          <div className={classes.useritem__image}>
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}${props.image}`}
              alt={props.name}
            />
          </div>
          <div className={classes.useritem__info}>
            <h2>{props.name}</h2>
            <h3>
              {props.placesCount}
              {props.placesCount === 1 ? " Place" : " Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
export default UserItem;
