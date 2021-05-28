import { makeStyles } from "@material-ui/core";
export default function Styling() {
  return makeStyles((theme) => ({
    root: {
      height: "100vh",
    },
    margin: {
      margin: theme.spacing(0.5),
    },
    sidebar: {
      height: "105vh",
      backgroundColor: "#5885af",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "10",
    },

    sidebarPulledUp: {
      marginTop: "-10000000px",
    },

    dropIconFixedTop: {
      position: "absolute",
      top: "0",
      zIndex: "15",
    },
    textInputColor: {
      color: "white",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "#b1d4e0",
      border: "2px solid #fff",
      borderRadius: "5px",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: "350px",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
    },
    cssOutlinedInput: {
      "&$cssFocused": {
        borderColor: "white !important",
      },
    },
    cssFocused: { color: "white !important" },

    gridSide: {
      position: "relative",
      marginRight: "-12%",
    },
  }));
}
