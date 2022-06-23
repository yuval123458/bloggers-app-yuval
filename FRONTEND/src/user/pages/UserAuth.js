import React, { useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import "./UserAuth.css";
import Card from "../../shared/components/UI/Card";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authReducer";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { Fragment } from "react";
import useHttp from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const UserAuth = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, clearError, sendRequest } = useHttp();
  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const LoginHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.formInputs,
          name: undefined,
          image: undefined,
        },
        formState.formInputs.email.isValid &&
          formState.formInputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.formInputs,
          name: {
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
    }
    setIsLogin((prevLogin) => !prevLogin);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.formInputs);

    if (isLogin) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.formInputs.email.value,
            password: formState.formInputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        dispatch(
          authActions.login({ userId: response.userId, token: response.token })
        );
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.formInputs.email.value);
        formData.append("name", formState.formInputs.name.value);
        formData.append("password", formState.formInputs.password.value);
        formData.append("image", formState.formInputs.image.value);
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        dispatch(
          authActions.login({ userId: response.userId, token: response.token })
        );
      } catch (error) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <header>{isLogin ? <p>Login</p> : <p>SignUp</p>}</header>
        <form onSubmit={submitHandler}>
          {!isLogin && (
            <Input
              id="name"
              label="Your Name"
              type="text"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              error="Please enter a valid name"
              onInput={InputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload center={true} id="image" onInput={InputHandler} />
          )}
          <Input
            id="email"
            label="E-mail"
            type="email"
            element="input"
            validators={[VALIDATOR_EMAIL()]}
            error="Please enter a valid Email"
            onInput={InputHandler}
          />
          <Input
            id="password"
            label="Password"
            autoComplete="off"
            type="text"
            element="input"
            validators={[VALIDATOR_MINLENGTH(6)]}
            error="Please enter a valid password (between 5-10 characters)"
            onInput={InputHandler}
          />
          <Button type="submit" disabled={!formState.formIsValid}>
            {isLogin ? <p>Login</p> : <p>SignUp</p>}
          </Button>
        </form>
        <footer>
          <Button inverse onClick={LoginHandler}>
            {isLogin ? (
              <p>Dont have an account? Click to Sign Up </p>
            ) : (
              <p>already have an account? Click to Log In</p>
            )}
          </Button>
        </footer>
      </Card>
    </Fragment>
  );
};

export default UserAuth;
