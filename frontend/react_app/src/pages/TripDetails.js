import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

import api from '../api';
import TripSummary from '../components/TripSummary';
import SideBar from '../components/SideBar';
import useStyles from '../style';
// import BudgetOverview from '../components/BudgetOverview';
// import MapOverview from '../components/MapOverview';
// import Orders from '../components/Orders';


export default function TripDetails(props) {
    const classes = useStyles();
    let { id } = useParams()
    const [ tripDetails, setTripDetails ] = useState({});
    const  [ hasError, setErrors ] =  useState(false);

    async function fetchData() {
        const res = await fetch(api.trips.detail(props.token, id));
        res.json()
        .then(res => {
            setTripDetails(res)
        })
        .catch(err => setErrors(err));
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
      <div className={classes.secondaryRoot}>
        <SideBar tripDetails={tripDetails} isDashboardView={true} fetchData={fetchData} token={props.token}/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Calendar */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>

                </Paper>
              </Grid>
              {/* Map Overview*/}
              <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>
                  {/* <MapOverview start_location={tripDetails.start_location} apiKey={("AIzaSyA6iG7LGNxxs_ZT6eIkTUWK1sCd9Xf6i9w")}/> */}
                </Paper>
              </Grid>
              {/* Budget */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper className={classes.fixedHeightPaper}>
                  {/* <BudgetOverview trip={tripDetails}/> */}
                </Paper>
              </Grid>
              {/* TripSummary */}
              <Grid item xs={12}>
                <Paper className={classes.secondaryPaper}>
                  <TripSummary trip={tripDetails}/>
                </Paper>
              </Grid>
              {/* Recent Orders
              <Grid item xs={12}>
                <Paper className={classes.secondaryPaper}>
                  <Orders />
                </Paper>
              </Grid> */}
            </Grid>
          </Container>
        </main>
      </div>
    );
}
