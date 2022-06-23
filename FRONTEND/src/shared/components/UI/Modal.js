import React, { Fragment } from "react";
import "./Modal.css";
import ReactDOM from "react-dom";
import Backdrop from "../navigation/Backdrop";
import { CSSTransition } from "react-transition-group";

const ModalOverLay = (props) => {
  let content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        {props.header}
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.formClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        timeout={1000}
        mountOnEnter
        unmountOnExit
        classNames="modal"
      >
        <ModalOverLay {...props} />
      </CSSTransition>
    </Fragment>
  );
};
export default Modal;
