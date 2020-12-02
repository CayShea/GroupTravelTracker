
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    table: {
        minWidth: 700,
      },
    root: {
      flexGrow: 1,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    title: {
      flex: '1 1 100%',
    },
  }));

export default useStyles;