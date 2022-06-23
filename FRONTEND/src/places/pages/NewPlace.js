import React, { useReducer } from "react";
import Input from "../../shared/components/FormElements/Input";
import "./placeForm.css";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import { useForm } from "../../shared/hooks/form-hook";
import useHttp from "../../shared/hooks/http-hook";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const { isLoading, error, clearError, sendRequest } = useHttp();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(formState.formInputs);
      const formData = new FormData();
      formData.append("title", formState.formInputs.title.value);
      formData.append("description", formState.formInputs.description.value);
      formData.append("address", formState.formInputs.address.value);
      formData.append("image", formState.formInputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + token,
        }
      );
      navigate("/");
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={submitHandler} className="place-form">
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <Input
          id="title"
          label="Title"
          type="text"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter a valid title"
          onInput={InputHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          error="Please enter a valid description (at least 5 characters)"
          onInput={InputHandler}
        />
        <Input
          id="address"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          error="Please enter a valid address "
          onInput={InputHandler}
        />
        <ImageUpload center={true} id="image" onInput={InputHandler} />
        <Button type="submit" disabled={!formState.formIsValid}>
          Submit New Place
        </Button>
      </form>
    </Fragment>
  );
};
export default NewPlace;
