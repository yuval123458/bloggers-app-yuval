import React, { useEffect, useReducer } from "react";
import { validate } from "../../util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  if (action.type === "CHANGE") {
    return {
      ...state,
      value: action.value,
      isValid: validate(action.value, action.validators),
    };
  }
  if (action.type === "TOUCH") {
    return {
      ...state,
      isTouched: true,
    };
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: props.isValid || false,
    isTouched: false,
  });

  const { value, isValid } = inputState;
  const { id, onInput } = props;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input
        onBlur={touchHandler}
        value={inputState.value}
        onChange={changeHandler}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
      />
    ) : (
      <textarea
        onBlur={touchHandler}
        value={inputState.value}
        onChange={changeHandler}
        id={props.id}
        rows={props.rows || 3}
      />
    );

  return (
    <div
      className={`form-control ${props.className} ${
        !inputState.isValid && inputState.isTouched
          ? "form-control--invalid"
          : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.error}</p>}
    </div>
  );
};
export default Input;
