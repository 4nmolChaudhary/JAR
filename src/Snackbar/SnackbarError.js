import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import _ from 'lodash'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function SnackbarSuccess(tostMsg) {
 
 var vertical = 'top'
 var horizontal = 'center'

 const [open, setOpen] = React.useState(true);
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div >
      <Snackbar open={open} autoHideDuration={5000}  anchorOrigin={{ vertical, horizontal }} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
         {tostMsg.tostMsg.msg}
        </Alert>
      </Snackbar>
     
    </div>
  );
}

