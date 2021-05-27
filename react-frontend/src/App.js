import React, { useState, useEffect, useRef } from "react";
import CallIcon from "@material-ui/icons/Call";
import EndCallIcon from "@material-ui/icons/CallEnd";
import CancelIcon from "@material-ui/icons/Cancel";
import VideocamIcon from "@material-ui/icons/Videocam";
import AssignmentIcon from "@material-ui/icons/Assignment";
import io from "socket.io-client";
import VideoCard from "./components/VideoCard";
import logo from "./kol-logo.png";
import "./App.css";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Styling from "./components/Styling";
import RingModal from "./components/RingModal";
import Peer from "simple-peer";
import CopyToClipboard from "react-copy-to-clipboard";
const socket = io.connect("http://localhost:3001");

const useStyles = Styling();

function App() {
  const [userId, setUserId] = useState("");
  const [stream, setStream] = useState();
  const [myName, setMyName] = useState("");
  const [callerId, setCallerId] = useState();
  const [callerName, setCallerName] = useState("");
  const [peerId, setPeerId] = useState("");
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [isCallAnswered, setIsCallAnswered] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callerSignal, setCallerSignal] = useState();

  const myVideo = useRef();
  const peerVideo = useRef();
  const peerConnectionRef = useRef();

  const classes = useStyles();

  useEffect(() => {
    const videoConstraints = {
      width: { max: "1080" },
      height: { max: "720" },
      framerate: { max: "10" },
    };
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        myVideo.current.srcObject = mediaStream;
      })
      .catch((err) => {
        console.log("ERR: " + err);
      });

    socket.on("userConnected", (id) => {
      setUserId(id);
    });

    socket.on("calling", (payload) => {
      setIsReceivingCall(true);
      setCallerId(payload.callerId);
      setCallerName(payload.callerName);
      setCallerSignal(payload.callerSignal);
    });
  }, []);

  const placeCall = (id) => {
    setIsCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (payload) => {
      socket.emit("callUser", {
        callRecipient: id,
        signalData: payload,
        callerId: userId,
        callerName: myName,
      });
    });

    peer.on("stream", (peerStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = peerStream;
        peerVideo.current.muted = false;
      }
    });

    socket.on("callAnswered", (payload) => {
      setIsCalling(false);
      setIsCallAnswered(true);
      setIsInCall(true);
      setCallerName(payload.callerName);
      peer.signal(payload.signal);
    });

    peerConnectionRef.current = peer;
  };

  const answerCall = () => {
    setIsCallAnswered(true);
    setIsInCall(true);
    setIsReceivingCall(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (payload) => {
      socket.emit("answerCall", {
        signal: payload,
        recipient: callerId,
        callerName: myName,
      });
    });

    peer.on("stream", (peerStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = peerStream;
        peerVideo.current.muted = false;
      }
    });

    peer.signal(callerSignal);
    peerConnectionRef.current = peer;
  };

  const endCall = (id) => {
    id = id ? id : peerId;
    setIsCallAnswered(false);
    setIsCallEnded(true);
    setIsInCall(false);
    setCallerName("");
    setCallerId("");
    socket.emit("endCall", {
      recipient: id,
    });
    peerConnectionRef.current.destroy();
  };

  const declineCall = (id) => {
    socket.emit("decline", {
      recipient: id,
    });
    setIsReceivingCall(false);
  };
  const cancelCall = (id) => {
    setIsCalling(false);
    socket.emit("cancelCall", {
      recipient: id,
    });
  };
  const setUserNameValue = (e) => {
    e.preventDefault();
    setMyName(e.target.value);
  };

  const setPeerIDValue = (e) => {
    e.preventDefault();
    setPeerId(e.target.value);
  };

  socket.on("callCanceled", () => {
    setIsReceivingCall(false);
  });

  socket.on("callDeclined", () => {
    setIsCalling(false);
  });

  socket.on("callEnded", () => {
    if (!isInCall) return;
    setCallerName("");
    setCallerId("");
    setIsCallAnswered(false);
    setIsCallEnded(true);
    setIsInCall(false);
  });

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={3}>
        <Box className={classes.sidebar}>
          <div className='container box'>
            <div className='logo-container'>
              <img className='logo' src={logo}></img>
            </div>
            <div className='innerbox'>
              <div className='textInputContainer'>
                <TextField
                  id='filled-basic'
                  label='Name'
                  variant='filled'
                  value={myName}
                  fullWidth
                  className={classes.margin}
                  onChange={setUserNameValue}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.textInputColor,
                      focused: classes.cssFocused,
                    },
                  }}
                />
                <TextField
                  id='filled-basic'
                  label='My Calling ID'
                  variant='filled'
                  value={userId}
                  fullWidth
                  className={classes.margin}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                    },
                    endAdornment: (
                      <InputAdornment position='end'>
                        <CopyToClipboard text={userId}>
                          <IconButton color='primary' className='no-padding'>
                            <AssignmentIcon />
                          </IconButton>
                        </CopyToClipboard>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.textInputColor,
                      focused: classes.cssFocused,
                    },
                  }}
                />

                <TextField
                  id='filled-basic'
                  label='Peer ID'
                  variant='filled'
                  value={peerId}
                  fullWidth
                  className={classes.margin}
                  onChange={setPeerIDValue}
                  required
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.textInputColor,
                      focused: classes.cssFocused,
                    },
                  }}
                />
              </div>
            </div>

            <div className='callControls'>
              {!isCalling ? (
                !isInCall ? (
                  <Button
                    onClick={() => placeCall(peerId)}
                    color='primary'
                    size='large'
                    variant='contained'
                    startIcon={<CallIcon />}
                  >
                    Call
                  </Button>
                ) : (
                  <Button
                    onClick={() => endCall(callerId)}
                    color='secondary'
                    size='large'
                    variant='contained'
                    startIcon={<EndCallIcon />}
                  >
                    End Call
                  </Button>
                )
              ) : (
                <div className='button-group'>
                  <Button
                    color='primary'
                    size='large'
                    variant='contained'
                    disabled
                    className={classes.margin}
                    startIcon={<CallIcon />}
                  >
                    Calling
                  </Button>
                  <Button
                    color='secondary'
                    size='large'
                    variant='contained'
                    className={classes.margin}
                    onClick={() => cancelCall(peerId)}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Grid>
      <Grid item xs={9} className='call-div'>
        <RingModal
          open={isReceivingCall}
          modalClass={classes.modal}
          paper={classes.paper}
        >
          <div className='modalText'>
            <h3>{callerName} is Calling.</h3>
          </div>
          <Button
            color='primary'
            size='large'
            variant='contained'
            startIcon={<VideocamIcon />}
            onClick={answerCall}
            className={classes.margin}
          >
            Answer
          </Button>

          <Button
            color='secondary'
            size='large'
            variant='contained'
            startIcon={<CancelIcon />}
            onClick={() => declineCall(callerId)}
            className={classes.margin}
          >
            Decline
          </Button>
        </RingModal>
        <VideoCard
          videoStream={myVideo}
          canvasClass={!isInCall ? "video-canvas-lg" : "video-canvas-sm"}
          videoClass={!isInCall ? "video-element-lg" : "video-element-sm"}
          labelClass={!isInCall ? "video-label-lg" : "video-label-sm"}
          mute={true}
          userName={myName}
        ></VideoCard>
        {isCallAnswered && !isCallEnded ? (
          <VideoCard
            videoStream={peerVideo}
            canvasClass='video-canvas-lg'
            videoClass='video-element-lg'
            labelClass='video-label-lg'
            userName={callerName}
          ></VideoCard>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default App;
