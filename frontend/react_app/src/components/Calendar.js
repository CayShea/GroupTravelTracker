import React, { useState, useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import TUICalendar from '@toast-ui/react-calendar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import RoomIcon from '@material-ui/icons/Room';
import CreateIcon from '@material-ui/icons/Create';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import BasicTimePicker from './BasicTimePicker';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import useStyles from '../style';
import api from '../api';

// TUI Calendar library we are using documentation :
//        https://nhn.github.io/tui.calendar/latest/
//        https://nhn.github.io/tui.calendar/latest/#how-cool-monthly-weekly-daily-and-various-view-types
//        https://github.com/nhn/toast-ui.react-calendar


const myTheme = {
    // month header 'dayname'
    'month.dayname.height': '42px',
    'month.dayname.borderLeft': 'none',
    'month.dayname.paddingLeft': '8px',
    'month.dayname.paddingRight': '0',
    'month.dayname.fontSize': '13px',
    'month.dayname.backgroundColor': 'inherit',
    'month.dayname.fontWeight': 'normal',
    'month.dayname.textAlign': 'left',

    // month day grid cell 'day'
    'month.holidayExceptThisMonth.color': '#f3acac',
    'month.dayExceptThisMonth.color': '#bbb',
    'month.weekend.backgroundColor': '#fafafa',
    'month.day.fontSize': '16px',

    // month schedule style
    'month.schedule.borderRadius': '5px',
    'month.schedule.height': '18px',
    'month.schedule.marginTop': '2px',
    'month.schedule.marginLeft': '10px',
    'month.schedule.marginRight': '10px',
}

function getTimeTemplate(schedule, isAllDay) {
  var html = [];

  if (!isAllDay) {
    html.push('<strong>' + moment(schedule.start.getTime()).format('HH:mm') + '</strong> ');
  }
  if (schedule.isPrivate) {
    html.push('<span class="calendar-font-icon ic-lock-b"></span>');
    html.push(' Private');
  } else {
    if (schedule.isReadOnly) {
      html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
    } else if (schedule.recurrenceRule) {
      html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
    } else if (schedule.attendees.length) {
      html.push('<span class="calendar-font-icon ic-user-b"></span>');
    } else if (schedule.location) {
      html.push('<span class="calendar-font-icon ic-location-b"></span>');
    }
    html.push(' ' + schedule.title);
  }

  return html.join('');
}

function getGridCategoryTemplate(category, schedule) {
  var tpl;

  switch(category) {
    case 'milestone':
      tpl = '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + schedule.bgColor + '">' + schedule.title + '</span>';
      break;
    case 'task':
      tpl = '#' + schedule.title;
      break;
    case 'allday':
      tpl = getTimeTemplate(schedule, true);
      break;
  }

  return tpl;
}

function getPadStart(value) {
  value = value.toString();

  return value.padStart(2, '0');
}


const Calendar = (props) => {
  const classes = useStyles();
  const calendarRef = React.createRef();
  const tripStartDate = new Date(props.tripDetails.startdate);
  const currentMonth = (tripStartDate.toLocaleString('default', { month: 'long' })).toUpperCase();
  const [ open, setOpen ] = useState(false);
  const  [ hasError, setErrors ] =  useState(false);
  const [ showCreateForm, setShowCreateForm ] = useState(true);
  const [ schedules, setSchedules ] = useState([]);
  const [ currentEventId, setCurrentEventId ] = useState('');
  const [ tripTimezoneName, setTripTimezoneName ] = useState('Arizona Mountain Time');
  const [ calendarView, setCalendarView ] = useState('week')
  const [ newEvent, setNewEvent ] = useState({
    trip_id: props.tripDetails.id,
    title: '',
    body: '',
    start: '',
    end: '',
    location: '',
    attendees: [],
    isPrivate: false
  });

  function _getFormattedTime(time) {
    const date = new Date(time);
    const h = date.getHours();
    const m = date.getMinutes();

    return `${h}:${m}`;
  };
  function _getTimeTemplate(schedule, isAllDay) {
    var html = [];

    if (!isAllDay) {
      html.push("<strong>" + _getFormattedTime(schedule.start) + "</strong> ");
    }
    if (schedule.isPrivate) {
      html.push('<span class="calendar-font-icon ic-lock-b"></span>');
      html.push(" Private");
    } else {
      if (schedule.isReadOnly) {
        html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
      } else if (schedule.recurrenceRule) {
        html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
      } else if (schedule.attendees.length) {
        html.push('<span class="calendar-font-icon ic-user-b"></span>');
      } else if (schedule.location) {
        html.push('<span class="calendar-font-icon ic-location-b"></span>');
      }
      html.push(" " + schedule.title);
    }

    return html.join("");
  };
  const templates = {
    time: function (schedule) {
      return _getTimeTemplate(schedule, false);
    },
    weekDayname: function(model) {
      return '<span class="tui-full-calendar-dayname-date">' + model.date + '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' + model.dayName + '</span>';
    },
    weekGridFooterExceed: function(hiddenSchedules) {
      return '+' + hiddenSchedules;
    },
    schedule: function(schedule) {
      return getGridCategoryTemplate(schedule.category, schedule);
    },
    collapseBtnTitle: function() {
      return '<span class="tui-full-calendar-icon tui-full-calendar-ic-arrow-solid-top"></span>';
    },
    timezoneDisplayLabel: function(timezoneOffset, displayLabel) {
      var gmt, hour, minutes;
  
      if (!displayLabel) {
        gmt = timezoneOffset < 0 ? '-' : '+';
        hour = Math.abs(parseInt(timezoneOffset / 60, 10));
        minutes = Math.abs(timezoneOffset % 60);
        displayLabel = gmt + getPadStart(hour) + ':' + getPadStart(minutes);
      }
      return displayLabel;
    },
    timegridDisplayPrimayTime: function(time) {
      let hour = time.hour;
      let meridiem = hour >= 12 ? 'pm' : 'am';
  
      if (hour > 12) {
        hour = hour - 12;
      }
  
      return hour + ' ' + meridiem;
    },
    timegridDisplayTime: function(time) {
      return getPadStart(time.hour) + ':' + getPadStart(time.hour);
    },
    timegridCurrentTime: function(timezone) {
      let templates = [];
  
      if (timezone.dateDifference) {
          templates.push('[' + timezone.dateDifferenceSign + timezone.dateDifference + ']<br>');
      }
  
      templates.push(moment(timezone.hourmarker.toUTCString()).format('HH:mm'));
      return templates.join('');
    }
  };

  const calendars= [
    {
      id: "notGoing",
      name: "Not Going",
      color: "#ffffff",
      bgColor: "#D3D3D3",
      dragBgColor: "#D3D3D3",
      borderColor: "#D3D3D3"
    },
    {
      id: "going",
      name: "Going",
      color: "#ffffff",
      bgColor: "#00a9ff",
      dragBgColor: "#00a9ff",
      borderColor: "#00a9ff"
    }
  ];

  const handleChange = (prop) => (event) => {
    setNewEvent({ ...newEvent, [prop]: event.target.value });
  };

  const onClickSchedule = useCallback((e) => {
    const { calendarId, id } = e.schedule;
    // const el = cal.current.calendarInst.getElement(id, calendarId);
  }, []);

  const onBeforeCreateSchedule = useCallback((scheduleData) => {
    setShowCreateForm(true);
    setDefaultEventTime(scheduleData);
    setOpen(true);
  }, []);

  const onBeforeDeleteSchedule = useCallback((res) => {
    const { id } = res.schedule;
    deleteEvent(id);
  }, []);

  const onBeforeUpdateSchedule = useCallback((e) => {
    setShowCreateForm(false);
    setCurrentEventId(e.schedule.id);
    const setStart = convertDateToISO(e.schedule.start);
    const setEnd = convertDateToISO(e.schedule.end);

    const event = {
      trip_id: props.tripDetails.id,
      title: e.schedule.title,
      body: e.schedule.body,
      start: setStart,
      end: setEnd,
      location: e.schedule.location,
      attendees: e.schedule.attendees,
      isPrivate: false
    };
    setNewEvent({ ...event });
    setOpen(true);
  }, []);

  // const onAfterRenderSchedule = useCallback(() => {
  //   const calendarInstance = calendarRef.current.getInstance();
  // }, []);
  
  const handleClickPrevButton = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.prev();
  };

  const handleClickNextButton = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.next();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      createOrEditEvent();
  };
  
  async function createOrEditEvent() {
    try {
      const res = showCreateForm ? await fetch(api.events.create(props.token, newEvent)) : await fetch(api.events.edit(props.token, newEvent, currentEventId));
      res.json()
      .then(() => {
          props.refetchTrip();
          handleClose();
        }
      )
    } catch (err) {
      setErrors(err)
    }
  };

  async function deleteEvent(id) {
    try {
      await fetch(api.events.delete(props.token, id)).then( props.refetchTrip())
    } catch (err) {
      setErrors(err)
    }
  }

  function convertDateToISO(incomingDate) {
    let testingUTCDate = new Date(incomingDate.toDate().toUTCString()).toString().slice(0, 24).concat(" UTC");
    let ISOformattedDate = new Date(testingUTCDate).toISOString().slice(0, -1);

    return ISOformattedDate
  };

  const setDefaultEventTime = (scheduleData) => {
    let startDate = convertDateToISO(scheduleData.start);
    let endDate = convertDateToISO(scheduleData.end);

    setNewEvent({ 
      ...newEvent, 
      ['start']: startDate,
      ['end']: endDate
    });
  };

  const setCalendarDate = () => {
    const calendarInstance = calendarRef.current.getInstance();
    calendarInstance.setDate(tripStartDate);
  }
  useEffect(() => {
    setCalendarDate();;
  }, []);
  useEffect(() => {
    if (props.tripDetails.events.length > 0) {
      props.tripDetails.events.forEach(element => {
        element.start = new Date(element.start.slice(0, -1));
        element.end = new Date(element.end.slice(0, -1));
      })
    };
    setSchedules(props.tripDetails.events);
  }, []);

  const thissetCalendarView = (e) => {
    const calendarInstance = calendarRef.current.getInstance();
    setCalendarView(e.target.value);
    calendarInstance.changeView(e.target.value === "month" ? 'month' : 'week', true);
  }

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <div id="menu">
          <span id="menu-navi">
            <span>{currentMonth}</span>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                value={calendarView}
                onChange={thissetCalendarView}
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="month">Month</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={handleClickPrevButton}>
                <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={handleClickNextButton}>
                <ChevronRightIcon />
            </IconButton>
          </span>
          <span id="renderRange">Timezone: {tripTimezoneName}</span>
        </div>
        <TUICalendar
          ref={calendarRef}
          defaultView="week"
          theme={myTheme}
          template={templates}
          taskView={false}
          week= {{
            startDayOfWeek: (tripStartDate.getDay())
          }}
          // timezone= {{
          //   zones: [
          //     {
          //       timezoneOffset: 540,
          //       timezoneName: 'Asia/Seoul',
          //       displayLabel: 'GMT+09:00',
          //       tooltip: 'Seoul'
          //     },
          //     {
          //       timezoneOffset: -420,
          //       timezoneName: 'America/New_York',
          //       displayLabel: 'GMT-05:00',
          //       tooltip: 'New York',
          //     }
          //   ]
          // }}
          usageStatistics={false}
          useCreationPopup={false}
          useDetailPopup={true}
          calendars={calendars}
          schedules={schedules}
          onClickSchedule={onClickSchedule}
          onBeforeCreateSchedule={onBeforeCreateSchedule}
          onBeforeDeleteSchedule={onBeforeDeleteSchedule}
          onBeforeUpdateSchedule={onBeforeUpdateSchedule}
        />
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item sm={1}>
                      <LocalOfferIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Event"
                            value={newEvent.title}
                            onChange={handleChange('title')}
                            type="text"
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item sm={1}>
                      <RoomIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={9}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="location"
                            label="Location"
                            value={newEvent.location}
                            onChange={handleChange('location')}
                            type="text"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicTimePicker 
                            label="Start"
                            value={newEvent.start}
                            onChange={handleChange('start')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <BasicTimePicker 
                            label="End"
                            value={newEvent.end}
                            onChange={handleChange('end')}
                        />
                    </Grid>
                    <Grid item sm={1}>
                      <CreateIcon color="disabled"/>
                    </Grid>
                    <Grid item sm={11}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="body"
                            label="Details / Notes"
                            value={newEvent.body}
                            onChange={handleChange('body')}
                            type="text"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose}
                    variant="contained"
                    className={classes.submit}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                  {showCreateForm ? "Create" : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
      </Container>
    </div>
  )
}

export default Calendar;
