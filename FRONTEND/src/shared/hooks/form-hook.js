import { useCallback } from "react";
import { useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.formInputs) {
        if (!state.formInputs[inputId]) {
          continue;
        }
        if (inputId === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.formInputs[inputId].isValid;
        }
      }
      return {
        ...state,
        formInputs: {
          ...state.formInputs,
          [action.id]: { value: action.value, isValid: action.isValid },
        },
        formIsValid: formIsValid,
      };

    case "SET_DATA":
      return {
        formInputs: action.inputsData,
        formIsValid: action.formValidity,
      };
    default:
      return state;
  }
};

export const useForm = (formInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    formInputs: formInputs,
    formIsValid: initialFormValidity,
  });

  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      id: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const setFormData = useCallback((inputsData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputsData,
      formValidity,
    });
  }, []);

  return [formState, InputHandler, setFormData];
};
