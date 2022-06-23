import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./placeForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import useHttp from "../../shared/hooks/http-hook";
import { Fragment } from "react";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const UpdatePlace = () => {
  const { placeId } = useParams();
  const { isLoading, error, clearError, sendRequest } = useHttp();
  const [place, setPlace] = useState("");
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.formInputs.title.value,
          description: formState.formInputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {}
    navigate("/" + userId + "/places");
  };

  useEffect(() => {
    const getPlace = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    getPlace();
  }, [placeId, sendRequest, setFormData]);

  useEffect(() => {}, [setFormData, place]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && (
        <form onSubmit={submitHandler} className="place-form">
          {isLoading && (
            <div className="center">
              <LoadingSpinner asOverlay />
            </div>
          )}
          <Input
            id="title"
            element="input"
            value={place.title}
            isValid={true}
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            error="Please enter a valid title"
            onInput={InputHandler}
          />
          <Input
            id="description"
            element="textarea"
            value={place.description}
            isValid={true}
            onInput={InputHandler}
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            error="Please enter a valid description"
          />
          <Button type="submit" disabled={!formState.formIsValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </Fragment>
  );
};
export default UpdatePlace;
