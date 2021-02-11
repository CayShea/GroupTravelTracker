import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';

export default function Profile() {

    return (
          <div>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid xs={11} item justify="center">
                  Profile.... with ability to add/edit a profile image
              </Grid>     
            </Grid>
          </div>
    );
}
