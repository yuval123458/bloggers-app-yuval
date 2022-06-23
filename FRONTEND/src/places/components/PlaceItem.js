import React, { Fragment, useState } from "react";
import Card from "../../shared/components/UI/Card";
import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UI/Modal";
import Map from "../../shared/components/UI/Map";
import { useSelector } from "react-redux";
import useHttp from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";

const PlaceItem = (props) => {
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, clearError, sendRequest } = useHttp();
  console.log(`${process.env.REACT_APP_ASSET_URL} + ${props.image}`);

  const showMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const showModalHandler = () => {
    setShowConfirmModal(true);
  };

  const closeModalHandler = () => {
    setShowConfirmModal(false);
  };

  const deleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {}
    props.onDelete(props.id);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        formClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map zoom={8} center={props.location} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        header="are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button onClick={closeModalHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={deleteHandler} danger>
              DELETE
            </Button>
          </Fragment>
        }
      >
        {" "}
        <p>
          {" "}
          are you sure you want to proceed ? all unsaved data will be lost!
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay />
            </div>
          )}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={showMapHandler} inverse>
              {" "}
              Show Place On Map
            </Button>
            {userId === props.creatorId && (
              <Button to={`${props.id}`}> Edit</Button>
            )}
            {userId === props.creatorId && (
              <Button onClick={showModalHandler} danger>
                {" "}
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};
export default PlaceItem;
