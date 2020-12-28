import React, { useState } from 'react';
import Title from './Title';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  calendar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5px',
    top: '64px',
  },
}));

// const myTheme = {
//   'month.schedule.height': '24px',
//   'month.day.color': 'rgba(51, 51, 51, 0.4)',
//   'common.border': '1px solid #e5e5e5',
//   'common.day.height': "5px"
// };

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

const CalendarOverview = (props) => {
  const [date, changeDate] = useState(new Date());
  const classes = useStyles();

  return (
    <>
      <Title>Calendar</Title>
      <Calendar
        className={classes.calendar}
        view="month"
        isAlways6Week={false}
        calendars={[
          {
            id: '0',
            name: 'Private',
            bgColor: '#9e5fff',
            borderColor: '#9e5fff'
          },
          {
            id: '1',
            name: 'Company',
            bgColor: '#00a9ff',
            borderColor: '#00a9ff'
          }
        ]}
        isReadOnly={true}
        month={{
          startDayOfWeek: 0,
          visibleWeeksCount: 4
        }}
        // schedules={[
        //   {
        //     id: '1',
        //     calendarId: '0',
        //     title: 'TOAST UI Calendar Study',
        //     category: 'time',
        //     dueDateClass: '',
        //     start: today.toISOString(),
        //     end: getDate('hours', today, 3, '+').toISOString()
        //   },
        //   {
        //     id: '2',
        //     calendarId: '0',
        //     title: 'Practice',
        //     category: 'milestone',
        //     dueDateClass: '',
        //     start: getDate('date', today, 1, '+').toISOString(),
        //     end: getDate('date', today, 1, '+').toISOString(),
        //     isReadOnly: true
        //   },
        //   {
        //     id: '3',
        //     calendarId: '0',
        //     title: 'FE Workshop',
        //     category: 'allday',
        //     dueDateClass: '',
        //     start: getDate('date', today, 2, '-').toISOString(),
        //     end: getDate('date', today, 1, '-').toISOString(),
        //     isReadOnly: true
        //   },
        //   {
        //     id: '4',
        //     calendarId: '0',
        //     title: 'Report',
        //     category: 'time',
        //     dueDateClass: '',
        //     start: today.toISOString(),
        //     end: getDate('hours', today, 1, '+').toISOString()
        //   }
        // ]}
        // scheduleView
        theme={myTheme}
      />
    </>
  );
}

export default CalendarOverview;