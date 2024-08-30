import React, { useState, useEffect } from 'react';
import { TextField, FormHelperText, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { CITYMASTER_URL_ENDPOINT, STATEMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler'; 
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CityMasterForm = () => {
  const [formData, setFormData] = useState({
    cityname: '',
    statecode: '',
    distance: ''
  });

  const [validationErrorstate, setValidationErrorstate] = useState(null);
  const [states, setStates] = useState([]);
  const [status, setStatus] = useState(null);
  const [editstatus, editsetStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [validationErrorCity, setValidationErrorCity] = useState(null);
  const [validationErrorCityedit, setValidationErrorCityedit] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'City Details' }]);
  const [cityGroups, setCityGroups] = useState([]);
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    fetchStates();
    if (tabValue === 1) {
      fetchCityGroups();
    }
  }, [tabValue]);

  const stateCodeToNameMap = states.reduce((acc, state) => {
    acc[state.code] = state.name;
    return acc;
  }, {});

  const fetchStates = async () => {
    try {
      const response = await axios.get(STATEMASTER_URL_ENDPOINT);
      console.log('Fetched states:', response.data);
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  const fetchCityGroups = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      console.log('Fetched City records:', response.data);
      setCityGroups(response.data);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setStatus(null);
    editsetStatus(null);
    setValidationError(null);
    setValidationErrorCity(null);
    setValidationErrorstate(null);
  };

  const handleEditFormChange = (event, rowCode) => {
    const { name, value } = event.target;
    setEditingRows({
      ...editingRows,
      [rowCode]: {
        ...editingRows[rowCode],
        [name]: value,
      },
    });
    setValidationErrorCityedit(null);
    editsetStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.cityname.trim()) {
      setValidationErrorCity('City Name is required');
      return;
    }
    if (!formData.statecode.trim()) {
      setValidationErrorstate('Please select the State');
      return;
    }
    if (formData.cityname.trim().length > 50) {
      setValidationError('City Name cannot exceed 50 characters');
      return;
    }
    try {
      const response = await axios.post(`${CITYMASTER_URL_ENDPOINT}`, {
        CODE: "",
        NAME: formData.cityname.trim(),
        STATECODE: formData.statecode.trim(),
        DISTANCE: formData.distance || "0",
      }, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setStatus({ type: 'success', message: 'City record added successfully!' });
        await fetchCityGroups();
        setFormData({ cityname: '', statecode: '', distance: '' });
        await sleep(1000);
        setStatus(null);
        setValidationError(null); 
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "City with the same name already exists in the selected state.") {
          setValidationError('City with the same name already exists in the selected state.');
        } else {
          setValidationError('Failed to add City record.');
        }
      } else {
        setStatus({ type: 'error', message: 'Failed to add City record.' });
      }
    }
  };

  const handleEditClick = (city) => {
    const newEditingRows = { ...editingRows };
    if (!newEditingRows[city.code]) {
      newEditingRows[city.code] = {
        cityname: city.name,
        statecode: city.statecode,
        distance: city.distance,
      };
    }
    setEditingRows(newEditingRows);

    const editTabExists = tabs.some(tab => tab.label === `Edit ${city.name}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${city.name}`, code: city.code }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${city.name}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
    setValidationError(null);
    setValidationErrorCity(null);
    setValidationErrorCityedit(null);
    setValidationErrorstate(null);
  };

  const handleUpdateClick = async (rowCode) => {
    if (!editingRows[rowCode].cityname.trim()) {
      setValidationErrorCityedit('City Name is required');
      return;
    }
    if (!editingRows[rowCode].statecode.trim()) {
      setValidationErrorstate('Please select the State');
      return;
    }
    if (editingRows[rowCode].cityname.trim().length > 50) {
      setValidationError('City Name cannot exceed 50 characters');
      return;
    }
    const editedCity = {
      CODE: rowCode,
      NAME: editingRows[rowCode].cityname.trim(),
      STATECODE: editingRows[rowCode].statecode.trim(),
      DISTANCE: editingRows[rowCode].distance || "0",
    };

    if (
      editedCity.CODE.length > 6 ||
      editedCity.NAME.length > 50
    ) {
      console.error("One or more fields exceed the maximum allowed length.");
      alert("One or more fields exceed the maximum allowed length.");
      return;
    }

    try {
      const response = await axios.put(`${CITYMASTER_URL_ENDPOINT}/${editedCity.CODE}`, editedCity, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204) {
        await fetchCityGroups();
        handleTabClose(rowCode);
        setValidationError(null); 
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "City with the same name already exists in the selected state.") {
          editsetStatus({ type: 'error', message: 'City with the same name already exists in the selected state.' });
        } else {
          editsetStatus({ type: 'error', message: 'Failed to update City record.' });
        }
      } else {
        console.error("Error updating City record", error);
        editsetStatus({ type: 'error', message: 'Failed to update City record.' });
      }
    }
  };

  const handleCancelUpdateClick = (rowCode) => {
    handleTabClose(rowCode);
    editsetStatus(null);
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
    setFormData({ cityname: '', statecode: '', distance: '' });
    setStatus(null);
    setValidationError(null);
    setValidationErrorCity(null);
    setValidationErrorCityedit(null);
    setValidationErrorstate(null);
  };

  const handleEdit = () => {
    const listTabExists = tabs.some(tab => tab.label === 'City Master List');
    if (!listTabExists) {
      setTabs([...tabs, { label: 'City Master List' }]);
    }
    const listTabIndex = tabs.findIndex(tab => tab.label === 'City Master List');
    setTabValue(listTabIndex >= 0 ? listTabIndex : tabs.length);
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
              <Typography variant="subtitle1" gutterBottom>
                City Master Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="cityname"
                    name="cityname"
                    label="City Name"
                    value={formData.cityname || ''}
                    onChange={handleChange}
                    variant="outlined" margin="dense"
                    error={!!validationErrorCity}
                    helperText={validationErrorCity}
                  />
                </Grid>
                <Grid item xs={12} sm={6} marginTop={1}>
                <FormControl fullWidth error={!!validationErrorstate}>
                <InputLabel>Select State</InputLabel>
                <Select
                  label="Select State"
                  name="statecode"
                  value={formData.statecode || ''}
                  onChange={handleChange}
                >
                  {states.length > 0 ? (
                    states.map((state) => (
                      <MenuItem key={state.code} value={state.code}>
                        {state.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No states available</MenuItem>
                  )}
                </Select>
                {validationErrorstate && (
                  <FormHelperText>{validationErrorstate}</FormHelperText>
                )}
              </FormControl>
                </Grid>
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
            <Typography variant="subtitle1" gutterBottom>
              City Master List
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 4000, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <Table stickyHeader sx={{ minWidth: 650, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>City Code</StyledTableCell>
                    <StyledTableCell>City Name</StyledTableCell>
                    <StyledTableCell>State Name</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cityGroups.map((city) => (
                    <StyledTableRow key={city.code}>
                      <StyledTableCell>{city.code}</StyledTableCell>
                      <StyledTableCell>{city.name}</StyledTableCell>
                      <StyledTableCell>{stateCodeToNameMap[city.statecode] || city.statecode}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Box display="flex" justifyContent="center">
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-customEdit"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(city)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-outlinedError"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(
                              CITYMASTER_URL_ENDPOINT,
                              city.code,
                              city.name,
                              setCityGroups,
                              cityGroups,
                              'code',
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
              <Typography variant="subtitle1" gutterBottom>
                Edit
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City Name"
                    name="cityname"
                    value={editingRows[tabs[tabValue].code]?.cityname || ''}
                    onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                    variant="outlined"
                    margin="dense"
                    error={!!validationErrorCityedit}
                    helperText={validationErrorCityedit}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="dense" error={!!validationErrorstate}>
                    <InputLabel>Select State</InputLabel>
                    <Select
                      label="Select State"
                      name="statecode"
                      value={editingRows[tabs[tabValue].code]?.statecode || ''}
                      onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.code} value={state.code}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrorstate && (
                      <FormHelperText>{validationErrorstate}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
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

export default CityMasterForm;
