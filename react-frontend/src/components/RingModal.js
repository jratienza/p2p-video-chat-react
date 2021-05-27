import React from "react";
import { Modal, Fade, Backdrop } from "@material-ui/core";
import Styling from "./Styling";
export default function RingModal(props) {
  const classes = Styling();
  console.log(classes.classes);
  return (
    <Modal
      aria-labelledby='receiving-call-modal'
      className={props.modalClass}
      open={props.open}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={props.paper}>{props.children}</div>
      </Fade>
    </Modal>
  );
}
