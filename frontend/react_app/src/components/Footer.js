import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


function Footer() {
    return (
      <Typography variant="body2" color="textSecondary" align="center" style={{margin: '50px'}}>
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Group Travel Tracker
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
export default Footer