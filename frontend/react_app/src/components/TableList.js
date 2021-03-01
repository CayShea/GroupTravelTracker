import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';

import useStyles from '../style';
import TripForm from '../components/TripForm';
import api from '../api';


function EnhancedTableHead(props) {
  // const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all trips' }}
          /> */}
        </TableCell>
        {props.headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};
EnhancedTableHead.defaultProps = {
  numSelected: 0
};


const EnhancedTableToolbar = (props) => {
  const classes = useStyles();
  const { numSelected, tableTitle } = props;

  return (
    <Toolbar className={clsx(classes.root)}>
        <TripForm reloadScreen={props.reloadScreen} token={props.token} create={true}></TripForm>
        <Typography className={classes.title}  color="primary" variant="h6" id="tableTitle" component="div" align='center'>
            {tableTitle}
        </Typography>

        {numSelected > 0 ? (
            <Tooltip title="Delete Trip">
                <IconButton aria-label="delete" color="primary" onClick={props.deleteSelected}>
                    <DeleteIcon fontSize="default" />
                </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Delete Trip">
              <span>
                  <IconButton aria-label="delete" disabled>
                      <DeleteIcon fontSize="default" />
                  </IconButton>
              </span>
            </Tooltip>
        )
    }
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string.isRequired,
};
EnhancedTableToolbar.defaultProps = {
  numSelected: 0
};

export default function TableList(props) {
  const classes = useStyles();
  const history = useHistory();
  const [ selected, setSelected ] = useState([]);
  const  [ hasError, setErrors ] =  useState(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.trips.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    let newSelected = name === selected ? '' : name;
    // const selectedIndex = selected.indexOf(name);
    // let newSelected = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }

    setSelected(newSelected);
  };

  async function deleteSelected(){
        try {
          await fetch(api.trips.delete(props.token, selected)).then(props.fetchData)
        } catch (err) {
          setErrors(err)
        }
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}> 
      <Grid container justify="center">     
        <Grid item xs={10}>
          <Paper className={classes.ternaryPaper}>
            <EnhancedTableToolbar reloadScreen={props.fetchData} token={props.token} tableTitle={props.tableTitle} deleteSelected={deleteSelected} numSelected={selected.length}/>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={props.trips.length}
                  headCells={props.headCells}
                />
                <TableBody>
                  { props.trips.length > 0 ?
                    ( props.trips.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`
                            return (
                                <TableRow 
                                    key={row.id}
                                    hover
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.hoverCursor} component="th" scope="row" onClick={() => {history.push(`/trips/${row.id}`)}}>{row.name}</TableCell>
                                    <TableCell align="left">{row.startdate}</TableCell>
                                    <TableCell align="left">{row.location.title}</TableCell>
                                    <TableCell align="left">{row.budget}</TableCell>
                                    <TableCell align="left">{row.classification === 'none' ?  '--' : row.classification}</TableCell>
                                </TableRow>
                            )})
                    ) : (
                      <TableRow />
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
