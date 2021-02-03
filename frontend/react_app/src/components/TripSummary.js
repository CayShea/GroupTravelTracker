import React from 'react';
import { useTheme } from '@material-ui/core/styles';
// import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemText from '@material-ui/core/ListItemText';

import useStyles from '../style';


export default function TripSummary(props) {
  const theme = useTheme();
  const classes = useStyles();

  const tripDetails = {
    "Location": props.trip.location ? props.trip.location.title : '--',
    "Dates": props.trip.startdate ? `${props.trip.startdate} to ${props.trip.enddate}` : '--',
    "Budget": props.trip.budget ? props.trip.budget : '--',
    "Summary": props.trip.summary ? props.trip.summary : '--',
    "Classification": props.trip.classification,
  }

  return (
    <React.Fragment>
      <Title>Trip Summary</Title>
      <div className={classes.demo}>
        <List dense>
          { Object.keys(tripDetails).map((key, index) => {
            return (
              <ListItem key={index}>
                <ListItemIcon>
                  <ArrowForwardIosIcon />
                </ListItemIcon>
                <ListItemText
                  primary={key}
                  secondary={tripDetails[key]}
                />
              </ListItem>
            )
          })}
        </List>
      </div>
</React.Fragment>
  );
}