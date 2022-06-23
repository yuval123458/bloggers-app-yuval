import React from "react";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
import Card from "../../shared/components/UI/Card";

import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
  if (!props.places || props.places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <p>No Places Found For This User.</p>
          <Button to="/places/new">SHARE NEW PLACE</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.places.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          address={place.address}
          title={place.title}
          description={place.description}
          creatorId={place.creatorId}
          location={place.location}
          onDelete={props.onDelete}
        />
      ))}{" "}
    </ul>
  );
};
export default PlaceList;
