import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { STATEMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler';
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const StateMasterForm = () => {
  const [formData, setFormData] = useState({
    stateName: '',
    stateCode: '',
    isUnionTerritory: false,
  });

  const [status, setStatus] = useState(null);
  const [editstatus, setEditStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [validationErrorcheck, setValidationErrorcheck] = useState(null);
  const [validationErrorcheckedit, setValidationErrorcheckedit] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'State Master Details' }]);
  const [stateMasters, setStateMasters] = useState([]);
  const [editingRows, setEditingRows] = useState({});

  const refresherror = () => {
    setValidationErrorcheck(null);
    setValidationErrorcheckedit(null);
  };

  const validationcheckfields = () =>{
    let errors = {};
    if (!formData.stateName.trim()) errors.name = 'State Name cannot be blank';
    if (!formData.stateCode.trim()) errors.code = 'State Code cannot be blank';
    if (formData.stateName.trim() && formData.stateName.trim().length > 50) errors.len = 'State Name cannot be greater than 50';
    if (formData.stateCode.trim() && formData.stateCode.trim().length > 2) errors.codelen = 'State Code cannot exceed 2 characters';
    setValidationErrorcheck(errors);
    if (Object.keys(errors).length > 0) {
      return "error";
    }
}

const validationcheckfieldsedit = (rowCode) =>{
  let errors = {};
  if (!editingRows[rowCode].stateName.trim()) errors.name = 'State Name cannot be blank';
  if (!editingRows[rowCode].stateCode.trim()) errors.code = 'State Code cannot be blank';
  if (editingRows[rowCode].stateName.trim() && editingRows[rowCode].stateName.trim().length > 50) errors.len = 'State Name cannot be greater than 50';
  if (editingRows[rowCode].stateCode.trim() && editingRows[rowCode].stateCode.trim().length > 2) errors.codelen = 'State Code cannot exceed 2 characters';
  setValidationErrorcheckedit(errors);
  if (Object.keys(errors).length > 0) {
    return "error";
  }
}

  useEffect(() => {
    if (tabValue === 1) fetchStateMasters();
  }, [tabValue]);

  const fetchStateMasters = async () => {
    try {
      const response = await axios.get(`${STATEMASTER_URL_ENDPOINT}`);
      setStateMasters(response.data);
    } catch (error) {
      console.error("Error fetching state masters", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setStatus(null);
    setEditStatus(null);
    setValidationError(null);
    refresherror();
  };

  const handleEditFormChange = (event, rowCode) => {
    refresherror();
    const { name, value, type, checked } = event.target;
    setEditingRows({
      ...editingRows,
      [rowCode]: {
        ...editingRows[rowCode],
        [name]: type === 'checkbox' ? checked : value,
      },
    });
    setEditStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(validationcheckfields() === "error")
      { return; }
    const isUnionTerritoryValue = formData.isUnionTerritory ? 't' : 'f';
    const newState = {
      NAME: formData.stateName.trim(),
      STATECOD: formData.stateCode.trim(),
      ISUT: isUnionTerritoryValue,
      COUNTRYCODE: '000001'
    };
    try {
      const response = await axios.post(`${STATEMASTER_URL_ENDPOINT}`, newState, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201) {
        setStatus({ type: 'success', message: 'State Master added successfully!' });
        setFormData({ stateName: '', stateCode: '', isUnionTerritory: false });
        await sleep(1000);
        setStatus(null);
        setEditStatus(null);
        setValidationError(null);
        refresherror();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "State Code already in use.") {
          setValidationError('State Code already in use.');
        } else {
          setValidationError('An error occurred. Please try again.');
        }
      } else {
        setValidationError('An error occurred. Please try again.');
      }
    }
  };

  const handleEditClick = (state) => {
    const newEditingRows = { ...editingRows };
    if (!newEditingRows[state.code]) {
      newEditingRows[state.code] = {
        stateName: state.name,
        stateCode: state.statecod,
        isUnionTerritory: state.isut === 't',
      };
    }
    setEditingRows(newEditingRows);
    refresherror();

    const editTabExists = tabs.some(tab => tab.label === `Edit ${state.name}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${state.name}`, code: state.code }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${state.name}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
  };

  const handleUpdateClick = async (rowCode) => {
    if(validationcheckfieldsedit(rowCode) === "error")
      { return; }
    const editedState = {
      CODE: rowCode,
      NAME: editingRows[rowCode].stateName.trim(),
      STATECOD: editingRows[rowCode].stateCode.trim(),
      ISUT: editingRows[rowCode].isUnionTerritory ? 't' : 'f',
      COUNTRYCODE: '000001'
    };

    try {
      const response = await axios.put(`${STATEMASTER_URL_ENDPOINT}/${editedState.CODE}`, editedState, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 204) {
        await fetchStateMasters();
        handleTabClose(rowCode);
        setValidationError(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "State Code already in existing record.") {
          setEditStatus({ type: 'error', message: 'State Code already in existing record.' });
        } else {
          setValidationError('An error occurred. Please try again.');
        }
      } else {
        setValidationError('An error occurred. Please try again.');
      }
    }
  };

  const handleCancelUpdateClick = (rowCode) => {
    handleTabClose(rowCode);
    setEditStatus(null);
    refresherror();
  };

  const handleTabClose = (rowCode) => {
    const tabIndex = tabs.findIndex(tab => tab.code === rowCode);
    setTabs(tabs.filter(tab => tab.code !== rowCode));
    setEditingRows(prevRows => {
      const { [rowCode]: _, ...remainingRows } = prevRows;
      return remainingRows;
    });
    setTabValue(1);
  };

  const handleCancel = () => {
    setFormData({ stateName: '', stateCode: '', isUnionTerritory: false });
    setStatus(null);
    setEditStatus(null);
    setValidationError(null);
    refresherror();
  };

  const handleEdit = () => {
    const listTabExists = tabs.some(tab => tab.label === 'State Master List');
    if (!listTabExists) {
      setTabs([...tabs, { label: 'State Master List' }]);
    }
    const listTabIndex = tabs.findIndex(tab => tab.label === 'State Master List');
    setTabValue(listTabIndex >= 0 ? listTabIndex : tabs.length);
    refresherror();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ padding: 1 }}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <Box p={2}>
        {tabValue === 0 && (
          <form onSubmit={handleSubmit}>
            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>State Master Details</Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State Name"
                  name="stateName"
                  value={formData.stateName}
                  onChange={handleChange}
                  variant="outlined"
                  margin="dense"
                  error={!!validationErrorcheck?.name || !!validationErrorcheck?.len}
                  helperText={validationErrorcheck?.name || validationErrorcheck?.len}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State Code"
                  name="stateCode"
                  value={formData.stateCode}
                  onChange={handleChange}
                  variant="outlined"
                  margin="dense"
                  inputProps={{ maxLength: 2 }}
                  error={!!validationErrorcheck?.code || !!validationErrorcheck?.codelen}
                  helperText={validationErrorcheck?.code || validationErrorcheck?.codelen}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isUnionTerritory}
                      onChange={handleChange}
                      name="isUnionTerritory"
                      color="primary"
                    />
                  }
                  label="Is it Union Territory?"
                />
              </Grid>
              {validationError && (
                <Typography variant="body2" color="red" style={{ marginTop: 10 }}>
                  {validationError}
                </Typography>
              )}
              {status && (
                <Typography variant="body2" color={status.type === 'success' ? 'green' : 'red'} style={{ marginTop: 10 }}>
                  {status.message}
                </Typography>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'left' }}>
              <Grid container spacing={2} justifyContent="left">
                <Grid item>
                  <CustomButton
                    type="submit"
                    variant="outlined"
                    className="MuiButton-outlinedPrimary"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton
                    variant="outlined"
                    className="MuiButton-outlinedSecondary"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton
                    variant="outlined"
                    className="MuiButton-customEdit"
                    onClick={handleEdit}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}

        {tabValue === 1 && (
          <Paper style={{ padding: 16, marginBottom: 1 }}>
            <Typography variant="subtitle1" gutterBottom>State Master List</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 4000, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <Table stickyHeader sx={{ minWidth: 650, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>State Name</StyledTableCell>
                    <StyledTableCell>State Code</StyledTableCell>
                    <StyledTableCell>Is it Union Territory?</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateMasters.map((state) => (
                    <StyledTableRow key={state.code}>
                      <StyledTableCell>{state.name}</StyledTableCell>
                      <StyledTableCell>{state.statecod}</StyledTableCell>
                      <StyledTableCell>{state.isut === 't' ? 'Yes' : 'No'}</StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" justifyContent="center">
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-customEdit"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(state)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-outlinedError"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(
                              STATEMASTER_URL_ENDPOINT,
                              state.code,
                              state.name,
                              setStateMasters,
                              stateMasters,
                              setEditingRows)}
                          >
                            Delete
                          </CustomButton>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue > 1 && tabs[tabValue] && (
          <form>
            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Edit Record</Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State Name"
                  name="stateName"
                  value={editingRows[tabs[tabValue].code]?.stateName || ''}
                  onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                  variant="outlined"
                  margin="dense"
                  error={!!validationErrorcheckedit?.name || !!validationErrorcheckedit?.len}
                  helperText={validationErrorcheckedit?.name || validationErrorcheckedit?.len}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="State Code" name="stateCode" value={editingRows[tabs[tabValue].code]?.stateCode || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                inputProps={{ maxLength: 2 }} 
                error={!!validationErrorcheckedit?.code || !!validationErrorcheckedit?.codelen} 
                helperText={validationErrorcheckedit?.code || validationErrorcheckedit?.codelen}/>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingRows[tabs[tabValue].code]?.isUnionTerritory || false}
                      onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                      name="isUnionTerritory"
                      color="primary"
                    />
                  }
                  label="Is it Union Territory?"
                />
              </Grid>
              {editstatus && (
                <Typography variant="body2" color={editstatus.type === 'success' ? 'green' : 'red'} style={{ marginTop: 10 }}>
                  {editstatus.message}
                </Typography>
              )}
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'left' }}>
              <Grid container spacing={2} justifyContent="left">
                <Grid item>
                  <CustomButton
                    variant="outlined"
                    className="MuiButton-outlinedPrimary"
                    startIcon={<SaveIcon />}
                    onClick={() => handleUpdateClick(tabs[tabValue].code)}
                  >
                    Update Changes
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton
                    variant="outlined"
                    className="MuiButton-outlinedSecondary"
                    startIcon={<CancelIcon />}
                    onClick={() => handleCancelUpdateClick(tabs[tabValue].code)}
                  >
                    Cancel
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Box>
    </div>
  );
};

export default StateMasterForm;
