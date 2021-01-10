import React, { useState, useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import TUICalendar from '@toast-ui/react-calendar';
import { ISchedule, ICalendarInfo } from "tui-calendar";
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import useStyles from '../style';

// https://nhn.github.io/tui.calendar/latest/

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

const Calendar = (props) => {
  const cal = useRef(null);
  const [date, changeDate] = useState(new Date());
  // const [ schedules, setSchedules ] = useState(props.tripMember.events)
  const classes = useStyles();
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
    // dayGridTitle: function(viewName) {
    //   return getGridTitleTemplate(viewName);
    // },
    // schedule: function(schedule) {
    //   return getGridCategoryTemplate(schedule.category, schedule);
    // },
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
  const start = new Date();
  const end = new Date(new Date().setMinutes(start.getMinutes() + 30));
  // Just need to push in the category, isVisible and calendarId into each
  // {
  //   body: "super doopity"
  //   end: "2020-11-26T00:12:00Z"
  //   id: "3nF2R5oDuEz8MqFVwJGZKM"
  //   start: "2020-11-26T00:11:30Z"
  //   title: "Concert"
  // }
  const schedules = [
    {
      calendarId: "going",
      category: "time",
      isVisible: true,
      title: "Study",
      id: "1",
      body: "Test",
      start,
      end
    },
    {
      calendarId: "notGoing",
      category: "time",
      isVisible: true,
      title: "Meeting",
      id: "2",
      body: "Description",
      start: new Date(new Date().setHours(start.getHours() + 1)),
      end: new Date(new Date().setHours(start.getHours() + 2))
    }
  ];

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
  const onClickSchedule = useCallback((e) => {
    const { calendarId, id } = e.schedule;
    const el = cal.current.calendarInst.getElement(id, calendarId);
  }, []);
  const onBeforeCreateSchedule = useCallback((scheduleData) => {
    console.log(scheduleData);
    const schedule = {
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      location: scheduleData.location,
      raw: {
        class: scheduleData.raw["class"]
      },
      state: scheduleData.state
    };

    cal.current.calendarInst.createSchedules([schedule]);
  }, []);

  const onBeforeDeleteSchedule = useCallback((res) => {
    const { id, calendarId } = res.schedule;

    cal.current.calendarInst.deleteSchedule(id, calendarId);
  }, []);

  const onBeforeUpdateSchedule = useCallback((e) => {
    console.log(e);
    const { schedule, changes } = e;

    cal.current.calendarInst.updateSchedule(
      schedule.id,
      schedule.calendarId,
      changes
    );
  }, []);

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <TUICalendar
          className={classes.calendar}
          view="week"
          theme={myTheme}
          template={templates}
          taskView={false}
          scheduleView={'allday'}
          week= {{
            showTimezoneCollapseButton: true,
            timezonesCollapsed: false,
          }}
          usageStatistics={false}
          useCreationPopup={true}
          useDetailPopup={true}
          calendars={calendars}
          schedules={schedules}
          onClickSchedule={onClickSchedule}
          onBeforeCreateSchedule={onBeforeCreateSchedule}
          onBeforeDeleteSchedule={onBeforeDeleteSchedule}
          onBeforeUpdateSchedule={onBeforeUpdateSchedule}
        />
      </Container>
    </div>
  )
}

export default Calendar;

// function getTimeTemplate(schedule, isAllDay) {
//   var html = [];

//   if (!isAllDay) {
//     html.push('<strong>' + moment(schedule.start.getTime()).format('HH:mm') + '</strong> ');
//   }
//   if (schedule.isPrivate) {
//     html.push('<span class="calendar-font-icon ic-lock-b"></span>');
//     html.push(' Private');
//   } else {
//     if (schedule.isReadOnly) {
//       html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
//     } else if (schedule.recurrenceRule) {
//       html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
//     } else if (schedule.attendees.length) {
//       html.push('<span class="calendar-font-icon ic-user-b"></span>');
//     } else if (schedule.location) {
//       html.push('<span class="calendar-font-icon ic-location-b"></span>');
//     }
//     html.push(' ' + schedule.title);
//   }

//   return html.join('');
// }

// function getGridTitleTemplate(type) {
//   var title = '';

//   switch(type) {
//     case 'milestone':
//       title = '<span class="tui-full-calendar-left-content">MILESTONE</span>';
//       break;
//     case 'task':
//       title = '<span class="tui-full-calendar-left-content">TASK</span>';
//       break;
//     case 'allday':
//       title = '<span class="tui-full-calendar-left-content">ALL DAY</span>';
//       break;
//   }

//   return title;
// }

// function getGridCategoryTemplate(category, schedule) {
//   var tpl;

//   switch(category) {
//     case 'milestone':
//       tpl = '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + schedule.bgColor + '">' + schedule.title + '</span>';
//       break;
//     case 'task':
//       tpl = '#' + schedule.title;
//       break;
//     case 'allday':
//       tpl = getTimeTemplate(schedule, true);
//       break;
//   }

//   return tpl;
// }

function getPadStart(value) {
  value = value.toString();

  return value.padStart(2, '0');
}
