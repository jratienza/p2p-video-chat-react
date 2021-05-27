import Typography from "@material-ui/core/Typography";
export default function VideoCard(props) {
  return (
    <div className={props.canvasClass}>
      <video
        className={props.videoClass}
        playsInline
        ref={props.videoStream}
        muted
        autoPlay
      ></video>
      <div>
        <Typography className={props.labelClass}>{props.userName}</Typography>
      </div>
    </div>
  );
}
