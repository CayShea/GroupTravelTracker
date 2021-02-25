
import { makeStyles } from '@material-ui/core/styles';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2),
      overflow: 'auto',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      alignItems: 'center'
    },
    secondaryPaper: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    ternaryPaper: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2),
      overflow: 'auto',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      alignItems: 'stretch',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    profileAvatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
      align: 'center'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      marginBottom: '10px'
    },
    submit: {
      margin: theme.spacing(4, 0, 2),
    },
    table: {
      minWidth: 700,
    },
    root: {
      flexGrow: 1,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    secondaryRoot: {
      display: 'flex'
    },
    dropdownInput: {
        width: 500,
        '& > * + *': {
          marginTop: theme.spacing(3),
        }
    },
    input: {
      display: 'none'
    },
    hrefDisplay: {
      textDecoration: 'none'
    },
    moreVerticalIcon: {
      marginLeft: 'auto'
    },
    title: {
      flex: '1 1 100%',
    },
    secondaryTitle: {
      flexGrow: 1
    },
    ternaryTitle: {
      fontSize: 16
    },
    textField: {
      marginTop:"12px",
      backgroundColor: theme.palette.common.white,
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      marginTop: theme.spacing(8),
      backgroundColor: '#2196f3',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginTop: theme.spacing(8),
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    whiteButton: {
      color: '#ffffff',
      // "&:hover, &.Mui-focusVisible": { backgroundColor: "#D3D3D3" }
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    container2: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    fixedHeight: {
      height: 300,
    },
    fixedHeightPaperCenterAlign: {
      padding: theme.spacing(2),
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: "#D3D3D3"
    },
    profilePaperBlocks: {
      marginTop: theme.spacing(5),
      padding: theme.spacing(2),
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: "#D3D3D3"
    },
    fixedHeightPaperLeftAlign: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: "#D3D3D3"
    },
    itineraryRow: {
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: "#ADD8E6",
      marginBottom: theme.spacing(1),
    },
    itineraryRowToday: {
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: "#FFFF99",
      marginBottom: theme.spacing(1),
    },
    avatarImage: {
      height: '100px',
      width: '100px',
    },
    uploadRow: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: '6px',
      marginLeft: '7px'
    },
    hoverCursor: {
      "&:hover" : {
        cursor: 'pointer'
      }
    }
  }));

export default useStyles;