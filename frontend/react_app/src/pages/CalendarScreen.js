import React, { useState } from 'react';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import SideBar from '../components/SideBar';
import useStyles from '../style';

// https://nhn.github.io/tui.calendar/latest/


// const useStyles = makeStyles((theme) => ({
//   calendar: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: '5px',
//     top: '64px',
//   },
// }));

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

const CalendarScreen = (props) => {
  const [date, changeDate] = useState(new Date());
  const classes = useStyles();
  const history = useHistory();
  const tripDetails = history.location.tripDetails;
  const templates = {
    weekDayname: function(model) {
      return '<span class="tui-full-calendar-dayname-date">' + model.date + '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' + model.dayName + '</span>';
    },
    weekGridFooterExceed: function(hiddenSchedules) {
      return '+' + hiddenSchedules;
    },
    dayGridTitle: function(viewName) {
      /*
       * use another functions instead of 'dayGridTitle'
       * milestoneTitle: function() {...}
       * taskTitle: function() {...}
       * alldayTitle: function() {...}
      */
  
      return getGridTitleTemplate(viewName);
    },
    schedule: function(schedule) {
      /*
       * use another functions instead of 'schedule'
       * milestone: function() {...}
       * task: function() {...}
       * allday: function() {...}
      */
  
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
      /* will be deprecated. use 'timegridDisplayPrimaryTime' */
      let hour = time.hour;
      let meridiem = hour >= 12 ? 'pm' : 'am';
  
      if (hour > 12) {
        hour = hour - 12;
      }
  
      return hour + ' ' + meridiem;
    },
    timegridDisplayPrimaryTime: function(time) {
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

  return (
    <div className={classes.secondaryRoot}>
      <SideBar tripDetails={tripDetails}/>
      <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Calendar
              className={classes.calendar}
              view="week"
              theme={myTheme}
              template={templates}
              week= {{
                showTimezoneCollapseButton: true,
                timezonesCollapsed: false,
              }}
            />
          </Container>
        </main>
    </div>
  )
}

export default CalendarScreen;

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

function getGridTitleTemplate(type) {
  var title = '';

  switch(type) {
    case 'milestone':
      title = '<span class="tui-full-calendar-left-content">MILESTONE</span>';
      break;
    case 'task':
      title = '<span class="tui-full-calendar-left-content">TASK</span>';
      break;
    case 'allday':
      title = '<span class="tui-full-calendar-left-content">ALL DAY</span>';
      break;
  }

  return title;
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