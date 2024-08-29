import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, InputLabel, TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { COMPMAST_URL_ENDPOINT, STATEMASTER_URL_ENDPOINT, CITYMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler';
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';

const CompanyMasterForm = () => {
  const [formData, setFormData] = useState({
    statecode: '', //
    citycode: '', //
    comP_NAME: '',
    comP_PATH: '',
    comP_ACID: '', //
    comp_acid_year: '', //
    comP_ACFD: '', //
    comP_FNAM: '', //
    comP_ADD: '',
    comP_FADD: '',
    comP_TELE: '', //
    comP_MAIL: '', //
    comP_PANO: '', //
    comP_LSDT: '-1',
    comP_URL: '', //
    comP_TANO: '', //
    comP_INDT: null,
    comP_OAD1: '', //
    comP_OAD2: '', //
    comP_OAD3: '', //
    comP_FAD1: '', //
    comP_FAD2: '', //
    comP_FAD3: '', //
    comP_LDAT: null,
    comP_FLAG: 't',
    comP_CURR: 'Rs',
    segmentreq: '1',
    clic: '0',
    blno: '',
    comP_GST: '', //
    comP_CIN: '',
    comP_MSMENO: '',
    comP_MSMESTAT: '',
    comP_STATECODE: '',
    comP_CITYCODE: '',
    comP_PINCODE: '', //
    comP_BNKNAME: '',
    comP_BNKADD: '',
    comP_BNKAC: '',
    comP_BNKRTGS: '',
    comP_RECSTAT: 'A',
    comP_REGDATE: '',
    comP_PREVNAME: ''
  });
  const [cityGroups, setCityGroups] = useState([]);
  const [states, setStates] = useState([]);
  const [status, setStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Company Master Details' }]);
  const [compMast, setCompMast] = useState([]);
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    fetchStates();

    if (tabValue === 1) {
      fetchCompMast();
    }
  }, [tabValue]);

  const handleGstChange = (value) => {
    let errorMessage = '';
    const stateCodePattern = /^[0-9]{2}/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const suffixPattern = /^[1-9][A-Z]{2}$/;
  
    // Check if the first two characters are digits (state code)
    if (value.length >= 2 && !stateCodePattern.test(value.slice(0, 2))) {
      errorMessage = 'GST number must start with two digits representing the state code.';
    } else if (value.length >= 12 && !panPattern.test(value.slice(2, 12))) {
      // Check if the next 10 characters form a valid PAN format
      errorMessage = 'The GST number must contain a valid PAN in the middle (5 letters, 4 numbers, and 1 letter).';
    } else if (value.length >= 15 && !suffixPattern.test(value.slice(12, 15))) {
      // Check the last 3 characters of the GST number
      errorMessage = 'The last three characters of the GST number should be alphanumeric, starting with a digit.';
    }
  
    // Set the validation error message
    setValidationError(errorMessage);
  
    // Extract PAN from GST if the input length is sufficient
    const pan = value.length >= 12 ? value.substring(2, 12) : '';
  
    // Update the form state with the GST number and PAN
    setFormData((prevData) => ({
      ...prevData,
      comP_GST: value,
      comP_PANO: pan
    }));
  };

  const fetchCityGroups = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);

      // Filter cities based on the selected state code
      const filteredCities = response.data.filter(city => city.statecode === formData.statecode);

      // Update the state with the filtered cities
      setCityGroups(filteredCities);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(STATEMASTER_URL_ENDPOINT);
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  const fetchCompMast = async () => {
    try {
      const response = await axios.get(COMPMAST_URL_ENDPOINT);
      setCompMast(response.data);
    } catch (error) {
      console.error("Error fetching company master", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (tabValue === 0) {

      if (name === 'comP_GST') {
        handleGstChange(value);
      } else {
        setFormData({ ...formData, [name]: value});
      }
      const updatedFormData = { ...formData, [name]: value };

      if (name === 'comP_OAD1' || name === 'comP_OAD2' || name === 'comP_OAD3') {
        updatedFormData.comP_ADD = [updatedFormData.comP_OAD1, updatedFormData.comP_OAD2, updatedFormData.comP_OAD3]
          .filter(part => part && part.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (name === 'comP_FAD1' || name === 'comP_FAD2' || name === 'comP_FAD3') {
        updatedFormData.comP_FADD = [updatedFormData.comP_FAD1, updatedFormData.comP_FAD2, updatedFormData.comP_FAD3]
          .filter(part => part && part.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      setFormData(updatedFormData);

      if (name === 'statecode') {
        formData.statecode = value;
        fetchCityGroups();
      }
    } else if (tabValue > 1) {

      if (name === 'comP_GST') {
        handleGstChange(value);
      } else {
        setEditingRows({ ...editingRows, [name]: value});
      }
      const updatedEditFormData = { ...editingRows[tabs[tabValue].code], [name]: value };

      if (name === 'comP_OAD1' || name === 'comP_OAD2' || name === 'comP_OAD3') {
        updatedEditFormData.comP_ADD = [updatedEditFormData.comP_OAD1, updatedEditFormData.comP_OAD2, updatedEditFormData.comP_OAD3]
          .filter(part => part && part.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (name === 'comP_FAD1' || name === 'comP_FAD2' || name === 'comP_FAD3') {
        updatedEditFormData.comP_FADD = [updatedEditFormData.comP_FAD1, updatedEditFormData.comP_FAD2, updatedEditFormData.comP_FAD3]
          .filter(part => part && part.trim())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      setEditingRows({
        ...editingRows,
        [tabs[tabValue].code]: updatedEditFormData,
      });

      if (name === 'statecode') {
        editingRows[tabs[tabValue].code].statecode = value;
        fetchCityGroups();
      }
    }
    setStatus(null);
    setValidationError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.comP_NAME || !formData.comP_ACID || !formData.comP_ACFD) {
      setValidationError('Please fill in all the required fields.');
      return;
    }

    formData.comP_STATECODE = formData.statecode;
    formData.comP_CITYCODE = formData.citycode;

    const { comp_acid_year, ...formDataWithoutYear } = formData;

    try {
      await axios.post(COMPMAST_URL_ENDPOINT, formDataWithoutYear, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      setStatus({ type: 'success', message: 'Company Master added successfully!' });
      setFormData({
        statecode: '', //
        citycode: '', //
        comP_NAME: '',
        comP_PATH: '',
        comP_ACID: '', //
        comp_acid_year: '', //
        comP_ACFD: '', //
        comP_FNAM: '', //
        comP_ADD: '',
        comP_FADD: '',
        comP_TELE: '', //
        comP_MAIL: '', //
        comP_PANO: '', //
        comP_LSDT: '-1',
        comP_URL: '', //
        comP_TANO: '', //
        comP_INDT: null,
        comP_OAD1: '', //
        comP_OAD2: '', //
        comP_OAD3: '', //
        comP_FAD1: '', //
        comP_FAD2: '', //
        comP_FAD3: '', //
        comP_LDAT: null,
        comP_FLAG: 't',
        comP_CURR: 'Rs',
        segmentreq: '1',
        clic: '0',
        blno: '',
        comP_GST: '', //
        comP_CIN: '',
        comP_MSMENO: '',
        comP_MSMESTAT: '',
        comP_STATECODE: '',
        comP_CITYCODE: '',
        comP_PINCODE: '', //
        comP_BNKNAME: '',
        comP_BNKADD: '',
        comP_BNKAC: '',
        comP_BNKRTGS: '',
        comP_RECSTAT: 'A',
        comP_REGDATE: '',
        comP_PREVNAME: ''
      });
      fetchCompMast();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add Company Master.' });
    }
  };

  const handleEditClick = (comp) => {
    const editTabExists = tabs.some(tab => tab.label === `Edit ${comp.comP_NAME}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${comp.comP_NAME}`, code: comp.comP_PATH }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${comp.comP_NAME}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);

    setEditingRows({
      ...editingRows,
      [comp.comP_PATH]: comp,
    });
  };

  const handleUpdateClick = async (rowCode) => {
    try {
      await axios.put(`${COMPMAST_URL_ENDPOINT}/${rowCode}`, editingRows[rowCode]);
      await fetchCompMast();
      handleTabClose(rowCode);
    } catch (error) {
      console.error("Error updating company", error);
    }
  };

  const handleCancelUpdateClick = (rowCode) => {
    handleTabClose(rowCode);
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
    setFormData({
      statecode: '', //
      citycode: '', //
      comP_NAME: '',
      comP_PATH: '',
      comP_ACID: '', //
      comp_acid_year: '', //
      comP_ACFD: '', //
      comP_FNAM: '', //
      comP_ADD: '',
      comP_FADD: '',
      comP_TELE: '', //
      comP_MAIL: '', //
      comP_PANO: '', //
      comP_LSDT: '-1',
      comP_URL: '', //
      comP_TANO: '', //
      comP_INDT: null,
      comP_OAD1: '', //
      comP_OAD2: '', //
      comP_OAD3: '', //
      comP_FAD1: '', //
      comP_FAD2: '', //
      comP_FAD3: '', //
      comP_LDAT: null,
      comP_FLAG: 't',
      comP_CURR: 'Rs',
      segmentreq: '1',
      clic: '0',
      blno: '',
      comP_GST: '', //
      comP_CIN: '',
      comP_MSMENO: '',
      comP_MSMESTAT: '',
      comP_STATECODE: '',
      comP_CITYCODE: '',
      comP_PINCODE: '', //
      comP_BNKNAME: '',
      comP_BNKADD: '',
      comP_BNKAC: '',
      comP_BNKRTGS: '',
      comP_RECSTAT: 'A',
      comP_REGDATE: '',
      comP_PREVNAME: ''
    });
    setStatus(null);
    setValidationError(null);
  };

  const handleEdit = () => {
    const editTabExists = tabs.some(tab => tab.label === 'Edit Company Master');
    if (!editTabExists) {
      setTabs([...tabs, { label: 'Edit Company Master' }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === 'Edit Company Master');
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
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
                Company Master Details
              </Typography>
              <Grid container paddingTop={1}>
                <Grid item xs={12} sm={6} paddingBottom={0.8}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="comP_NAME"
                    value={formData.comP_NAME}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3} paddingInline={2}>
                        <TextField
                          fullWidth
                          label="FY Starting Year"
                          name="comp_acid_year"
                          value={formData.comp_acid_year || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Update formData directly
                            handleChange({
                              target: {
                                name: 'comp_acid_year',
                                value: value,
                              },
                            });
                            // Update comP_ACID and comP_ACFD if the input is 4 digits
                            if (value.length === 4) {
                              const comP_ACID = `${value}-04-01T00:00`;
                              const comP_ACFD = `${parseInt(value, 10) + 1}-03-31T00:00`;
                              setFormData((prev) => ({
                                ...prev,
                                comP_ACID: comP_ACID,
                                comP_ACFD: comP_ACFD,
                              }));
                            }
                          }}
                          variant="outlined"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            maxLength: 4, // Limit input to 4 characters
                            placeholder: 'YYYY', // Placeholder for year
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} >
                      <TextField
                    fullWidth
                    label="Telephone"
                    name="comP_TELE"
                    value={formData.comP_TELE}
                    onChange={handleChange}
                    variant="outlined"
                   
                  />     
                      </Grid>
                <Grid item xs={12} sm={6} >
                  <TextField
                    fullWidth
                    label="Legal Name"
                    name="comP_FNAM"
                    value={formData.comP_FNAM}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={3}  paddingInline={2} >
                <TextField
                    fullWidth
                    label="Email"
                    name="comP_MAIL"
                    value={formData.comP_MAIL}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={3} >
                <TextField
                    fullWidth
                    label="URL"
                    name="comP_URL"
                    value={formData.comP_URL}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
                <Typography variant="subtitle1" gutterBottom>
                Addresss Details
              </Typography>
                <Grid container paddingTop={1} >
                <Grid item xs={12} sm={4} paddingBottom={0.8} >
                  <TextField
                    fullWidth
                    label="Registered Address line 1"
                    name="comP_OAD1"
                    value={formData.comP_OAD1}
                    onChange={handleChange}
                    //variant="outlined"
                    //marginleft="dense"
                    multiline
                  />
                </Grid>
                <Grid item xs={12}  sm={4} paddingInline={2}>
                  <TextField
                    fullWidth
                    label="Registered Address line 2"
                    name="comP_OAD2"
                    value={formData.comP_OAD2}
                    onChange={handleChange}
                    variant="outlined"
                    //margin="dense"
                    multiline
                   
                  />
                </Grid>
                <Grid item xs={12} sm={4} >
                  <TextField
                    fullWidth
                    label="Registered Address line 3"
                    name="comP_OAD3"
                    value={formData.comP_OAD3}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                  />
                </Grid>
                </Grid>
                <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}  paddingBottom={0.8}>
                  <TextField
                    fullWidth
                    label="Factory Office Address line 1"
                    name="comP_FAD1"
                    value={formData.comP_FAD1}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}>
                  <TextField
                    fullWidth
                    label="Factory Office Address line 2"
                    name="comP_FAD2"
                    value={formData.comP_FAD2}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}  >
                  <TextField
                    fullWidth
                    label="Factory Office Address line 3"
                    name="comP_FAD3"
                    value={formData.comP_FAD3}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                </Grid>
                <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}   paddingBottom={0.8}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Select State</InputLabel>
                    <Select
                      required
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}  >
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      required
                      label="Select City"
                      name="citycode"
                      value={formData.citycode || ''}
                      disabled={!formData.statecode}
                      onChange={handleChange}
                    >
                      {cityGroups.length > 0 ? (
                        cityGroups.map((city) => (
                          <MenuItem key={city.code} value={city.code}>
                            {city.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No city available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}   >
                  <TextField
                    fullWidth
                    label="Pin"
                    name="comP_PINCODE"
                    value={formData.comP_PINCODE}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="GST No" name="comP_GST" value={formData.comP_GST || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationError} helperText={validationError || ''} />
                  <TextField fullWidth label="PAN No" name="comP_PANO" value={formData.comP_PANO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="comP_REGDATE"
                    type="datetime-local"
                    value={formData.comP_REGDATE || ''}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="comP_TANO" value={formData.comP_TANO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="comP_CIN" value={formData.comP_CIN || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="comP_MSMENO" value={formData.comP_MSMENO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Previous Name (if any)"
                    name="comP_PREVNAME" //change
                    value={formData.comP_PREVNAME} //change
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="comP_MSMESTAT"
                      value={formData.comP_MSMESTAT || ''}
                      onChange={handleChange}
                    >
                      <MenuItem value="N.A."><em>N.A.</em></MenuItem>
                      <MenuItem value="Micro">Micro</MenuItem>
                      <MenuItem value="Small">Small</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>




            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Bank Information</Typography>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank Name" name="comP_BNKNAME" value={formData.comP_BNKNAME} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="comP_BNKRTGS" value={formData.comP_BNKRTGS} onChange={handleChange} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="comP_BNKAC" value={formData.comP_BNKAC} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="comP_BNKADD" value={formData.comP_BNKADD} onChange={handleChange} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
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
              {tabs[tabValue].label}
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 4000, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <Table stickyHeader sx={{ minWidth: 650, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Company Path</StyledTableCell>
                    <StyledTableCell>Company Name</StyledTableCell>
                    <StyledTableCell>Company Address</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compMast.map((comp) => (
                    <StyledTableRow key={comp.comP_PATH}>
                      <StyledTableCell>{comp.comP_PATH}</StyledTableCell>
                      <StyledTableCell>{comp.comP_NAME}</StyledTableCell>
                      <StyledTableCell>{comp.comP_ADD}</StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" justifyContent="center">
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-customEdit"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(comp)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-outlinedError"
                            startIcon={<DeleteIcon />}
                            onClick={() =>
                              handleDelete(
                                COMPMAST_URL_ENDPOINT,
                                comp.comP_PATH,
                                comp.comP_NAME,
                                setCompMast,
                                compMast,
                                setEditingRows
                              )}
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

        {tabValue > 1 && editingRows[tabs[tabValue].code] && (
          <form>
       <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>
                Company Master Details
              </Typography>
              <Grid container paddingTop={1}>
                <Grid item xs={12} sm={6} paddingBottom={0.8}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="comP_NAME"
                    value={editingRows[tabs[tabValue].code].comP_NAME}
                    onChange={handleChange}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={2.1} paddingLeft={2}>
                <TextField
                    fullWidth
                    label="FY Starting"
                    name="comP_ACID"
                    type="datetime-local"
                    value={editingRows[tabs[tabValue].code].comP_ACID || ''}
                    onChange={handleChange}
                    variant="outlined"
                   
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                      </Grid>
                      <Grid item xs={12} sm={2.05} paddingLeft={2}>
                <TextField
                    fullWidth
                    label="FY Starting"
                    name="comP_ACFD"
                    type="datetime-local"
                    value={editingRows[tabs[tabValue].code].comP_ACFD || ''}
                    onChange={handleChange}
                    variant="outlined"
                  
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                      </Grid>
                      <Grid item xs={12} sm={1.8}  paddingLeft={2}>
                      <TextField
                    fullWidth
                    label="Telephone"
                    name="comP_TELE"
                    value={editingRows[tabs[tabValue].code].comP_TELE}
                    onChange={handleChange}
                    variant="outlined"
                   
                  />     
                      </Grid>
                <Grid item xs={12} sm={6} >
                  <TextField
                    fullWidth
                    label="Legal Name"
                    name="comP_FNAM"
                    value={editingRows[tabs[tabValue].code].comP_FNAM}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={3}  paddingInline={2} >
                <TextField
                    fullWidth
                    label="Email"
                    name="comP_MAIL"
                    value={editingRows[tabs[tabValue].code].comP_MAIL}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={3} >
                <TextField
                    fullWidth
                    label="URL"
                    name="comP_URL"
                    value={editingRows[tabs[tabValue].code].comP_URL}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
                <Typography variant="subtitle1" gutterBottom>
                Addresss Details
              </Typography>
                <Grid container paddingTop={1} >
                <Grid item xs={12} sm={4} paddingBottom={0.8} >
                  <TextField
                    fullWidth
                    label="Registered Address line 1"
                    name="comP_OAD1"
                    value={editingRows[tabs[tabValue].code].comP_OAD1}
                    onChange={handleChange}
                    //variant="outlined"
                    //marginleft="dense"
                    multiline
                  />
                </Grid>
                <Grid item xs={12}  sm={4} paddingInline={2}>
                  <TextField
                    fullWidth
                    label="Registered Address line 2"
                    name="comP_OAD2"
                    value={editingRows[tabs[tabValue].code].comP_OAD2}
                    onChange={handleChange}
                    variant="outlined"
                    //margin="dense"
                    multiline
                   
                  />
                </Grid>
                <Grid item xs={12} sm={4} >
                  <TextField
                    fullWidth
                    label="Registered Address line 3"
                    name="comP_OAD3"
                    value={editingRows[tabs[tabValue].code].comP_OAD3}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                  />
                </Grid>
                </Grid>
                <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}  paddingBottom={0.8}>
                  <TextField
                    fullWidth
                    label="Factory Office Address line 1"
                    name="comP_FAD1"
                    value={editingRows[tabs[tabValue].code].comP_FAD1}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}>
                  <TextField
                    fullWidth
                    label="Factory Office Address line 2"
                    name="comP_FAD2"
                    value={editingRows[tabs[tabValue].code].comP_FAD2}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}  >
                  <TextField
                    fullWidth
                    label="Factory Office Address line 3"
                    name="comP_FAD3"
                    value={editingRows[tabs[tabValue].code].comP_FAD3}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                </Grid>
                <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}   paddingBottom={0.8}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Select State</InputLabel>
                    <Select
                      required
                      label="Select State"
                      name="statecode"
                      value={editingRows[tabs[tabValue].code].statecode || ''}
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}  >
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      required
                      label="Select City"
                      name="citycode"
                      value={editingRows[tabs[tabValue].code].citycode || ''}
                      disabled={!editingRows[tabs[tabValue].code].statecode}
                      onChange={handleChange}
                    >
                      {cityGroups.length > 0 ? (
                        cityGroups.map((city) => (
                          <MenuItem key={city.code} value={city.code}>
                            {city.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No city available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}   >
                  <TextField
                    fullWidth
                    label="Pin"
                    name="comP_PINCODE"
                    value={editingRows[tabs[tabValue].code].comP_PINCODE}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="GST No" name="comP_GST" value={editingRows[tabs[tabValue].code].comP_GST || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationError} helperText={validationError || ''} />
                  <TextField fullWidth label="PAN No" name="comP_PANO" value={editingRows[tabs[tabValue].code].comP_PANO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="comP_REGDATE"
                    type="datetime-local"
                    value={editingRows[tabs[tabValue].code].comP_REGDATE || ''}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="comP_TANO" value={editingRows[tabs[tabValue].code].comP_TANO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="comP_CIN" value={editingRows[tabs[tabValue].code].comP_CIN || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="comP_MSMENO" value={editingRows[tabs[tabValue].code].comP_MSMENO || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Previous Name (if any)"
                    name="comP_PREVNAME" //change
                    value={editingRows[tabs[tabValue].code].comP_PREVNAME} //change
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                  />                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="comP_MSMESTAT"
                      value={editingRows[tabs[tabValue].code].comP_MSMESTAT || ''}
                      onChange={handleChange}
                    >
                      <MenuItem value="N.A."><em>N.A.</em></MenuItem>
                      <MenuItem value="Micro">Micro</MenuItem>
                      <MenuItem value="Small">Small</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>




            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Bank Information</Typography>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank Name" name="comP_BNKNAME" value={editingRows[tabs[tabValue].code].comP_BNKNAME} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="comP_BNKRTGS" value={editingRows[tabs[tabValue].code].comP_BNKRTGS} onChange={handleChange} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="comP_BNKAC" value={editingRows[tabs[tabValue].code].comP_BNKAC} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="comP_BNKADD" value={editingRows[tabs[tabValue].code].comP_BNKADD} onChange={handleChange} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
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

export default CompanyMasterForm;
