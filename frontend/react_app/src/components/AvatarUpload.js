import React from "react";
import useStyles from '../style';


export default function AvatarUpload(props) {
  const [ file, setFile ] = React.useState("");

  function handleUpload(event) {
    setFile(event.target.files[0]);
    // let imageSrc = URL.createObjectURL(event.target.files[0])
    props.uploadAvatar(event.target.files[0]);
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {file && <ImageThumb image={file} />}
    </div>
  );
}

const ImageThumb = ({ image }) => {
  const classes = useStyles();
  return <img className={classes.avatarImage} src={URL.createObjectURL(image)} alt={image.name} />;
};
