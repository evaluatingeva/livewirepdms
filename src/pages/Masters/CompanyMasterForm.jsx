import React, { useState, useEffect } from 'react';
import { MenuItem, Select,FormHelperText, FormControl, InputLabel, TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { COMPMAST_URL_ENDPOINT, STATEMASTER_URL_ENDPOINT, CITYMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler';
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CompanyMasterForm = () => {
  const [formData, setFormData] = useState({
    statecode: '', //
    citycode: '', //ffetchcom
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
  const [cityGroupsedit, setCityGroupsedit] = useState([]);
  const [states, setStates] = useState([]);
  const [status, setStatus] = useState(null);
  const [editstatus, setEditStatus] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Company Master Details' }]);
  const [compMast, setCompMast] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [validationErrorcheck, setValidationErrorcheck] = useState(null);
  const [validationErrorcheckedit, setValidationErrorcheckedit] = useState(null);
  const [ValidationErrorGST, setValidationErrorGST  ] = useState(null);
  const [ValidationErrorGSTedit, setValidationErrorGSTedit  ] = useState(null);
  


  const refresherror = () => {
    setValidationErrorcheck(null);
    setValidationErrorcheckedit(null);
    
    //setValidationErrorcheckedit(null);
  };

  const validationcheckfields = () =>{
    let errors = {};
    if (!formData.comP_NAME) errors.name = 'Company Name cannot be blank';
    if (!formData.comP_ACID) errors.fyyear = 'FY Starting Year Cannot be blank';
    if (!formData.comP_FAD1 || !formData.comP_FAD2 ||!formData.comP_FAD3) errors.foa1 = 'Complete Factory adress Required fill all three textbox of factory address';
    if (!formData.comP_OAD1 || !formData.comP_OAD2 ||!formData.comP_OAD3) errors.roa1 = 'Complete Registered adress Required fill all three textbox of registered address';
    if (formData.comP_PINCODE && !/^\d{6}$/.test(formData.comP_PINCODE)) { errors.pinno = 'PIN Number must be exactly 6 digits';}
    
    if (!formData.comP_GST) errors.gstn = 'GST Number cannot be blank';
    if (formData.comP_GST && formData.comP_GST.length !== 15) errors.gstlength = 'GST Should be of 15 characters';
    if (!formData. comP_REGDATE) errors.regdate = 'Registration Date cannot be blank';
    if (!formData.comP_FNAM) errors.legname = 'Legal Name cannot be blank';
    if (!formData.comP_PINCODE) errors.pinno = 'PIN Number cannot be blank';
    if (!formData.citycode) errors.citycod = 'City Code cannot be blank';
    if (!formData.statecode) errors.statecode = 'State Code cannot be blank';
    if (formData.comP_CIN && formData.comP_CIN.length !== 21) errors.cinlength = 'CIN Should be of 21 charcaters';
    if (formData.comP_TANO && formData.comP_TANO.length !== 10) errors.tanlength = 'TAN Should be of 10 charcaters';
    if (formData.comP_MSMENO && formData.comP_MSMENO.length !== 19) errors.msmelength = 'MSME Number Should be of 19 charcaters';
    // Set the validation errors state
    setValidationErrorcheck(errors);
    // Return "error" if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return "error";
    }
}

const validationcheckfieldsedit = (rowCode) => {
  let errors = {};
  let row = { ...editingRows[rowCode] };  // Create a shallow copy of the row to avoid mutating the original object

  // Trim all string values in the row
  for (let key in row) {
    if (typeof row[key] === 'string') {
      row[key] = row[key].trim();
    }
  }

  if (!row.comP_NAME) errors.name = 'Unit Name cannot be blank';
  if (!row.comP_FAD1 || !row.comP_FAD2 || !row.comP_FAD3) errors.foa1 = 'Complete Factory address required; fill all three textboxes of factory address';
  if (!row.comP_OAD1 || !row.comP_OAD2 || !row.comP_OAD3) errors.roa1 = 'Complete Registered address required; fill all three textboxes of registered address';
  if (row.comP_PINCODE && !/^\d{6}$/.test(row.comP_PINCODE)) errors.pinno = 'PIN Number must be exactly 6 digits';
  if (!row.comP_PINCODE) errors.pinno = 'PIN Number cannot be blank';
  if (!row.comP_PANO) errors.pano = 'PAN cannot be blank';
  if (!row.comP_GST) errors.gstn = 'GST Number cannot be blank';
  if (row.comP_GST && row.comP_GST.length !== 15) errors.gstlength = 'GST Should be of 15 characters';
  if (!row.comP_REGDATE) errors.regdate = 'Registration Date cannot be blank';
  //if (!row.legname) errors.legname = 'Legal Name cannot be blank';
  if (!row.comP_CITYCODE) errors.citycod = 'City Code cannot be blank';
  if (!row.comP_STATECODE) errors.statecode = 'State Code cannot be blank';
  if (row.comP_CIN && row.comP_CIN.length !== 21) errors.cinlength = 'CIN Should be of 21 characters';
  if (row.comP_TANO && row.comP_TANO.length !== 10) errors.tanlength = 'TAN Should be of 10 characters';
  if (row.comP_MSMENO && row.comP_MSMENO.length !== 19) errors.msmelength = 'MSME Number should be of 19 characters';

  setValidationErrorcheckedit((prevErrors) => ({
    ...prevErrors,
    [rowCode]: errors
  }));

  if (Object.keys(errors).length > 0) {
    return "error";
  }
};

  useEffect(() => {
    fetchStates();
    if (tabValue === 1) {
      fetchCompMast();
    }
    if(tabValue>1)
      { fetchStates();
      fetchCityGroupsNORMAL();}
  }, [tabValue]);

  const fetchCityGroupsNORMAL = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      console.log('Fetched City records:', response.data);
      setCityGroupsedit(response.data);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };

  const fetchCityGroups = async (statecode) => {
    
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);

      // Filter cities based on the selected state code
      const filteredCities = response.data.filter(city => city.statecode === statecode);

      // Update the state with the filtered cities
      setCityGroups(filteredCities);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };

  const fetchCityGroupsEdit = async (statecode) => {
    
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
  
      // Filter cities based on the passed state code
      const filteredCities = response.data.filter(city => city.statecode === statecode);
  
      // Update the state with the filtered cities
      setCityGroupsedit(filteredCities);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };
  
  const fetchStates = async () => {
    try {
      const response = await axios.get(STATEMASTER_URL_ENDPOINT);
      setStates(response.data);
      console.log("states" , response.data)
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  const fetchCompMast = async () => {
    try {
      const response = await axios.get(`${COMPMAST_URL_ENDPOINT}`);
      
      // Trim the data after fetching
      const trimmedData = response.data.map(comp => 
        Object.fromEntries(
          Object.entries(comp).map(([key, value]) => [
            key,
            typeof value === 'string' ? value.trim() : value,
          ])
        )
      );
  
      setCompMast(trimmedData);
    } catch (error) {
      console.error("Error fetching company master", error);
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    let updatedFormData = {
      ...formData,
      [name]: value,
    };
  
    if (name === 'comP_GST') {
      // GST-specific validation and update logic
      let errorMessage = '';
      const stateCodePattern = /^[0-9]{2}/;
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}/;
      const suffixPattern = /^[1-9][A-Z]{2}$/;
  
      if (value.length >= 2 && !stateCodePattern.test(value.slice(0, 2))) {
        errorMessage = 'GST number must start with two digits representing the state code.';
      } else if (value.length >= 12 && !panPattern.test(value.slice(2, 12))) {
        errorMessage = 'The GST number must contain a valid PAN in the middle (5 letters, 4 numbers, and 1 letter).';
      } else if (value.length >= 15 && !suffixPattern.test(value.slice(12, 15))) {
        errorMessage = 'The last three characters of the GST number should be alphanumeric, starting with a digit.';
      }
  
      setValidationErrorGST(errorMessage);
  
      // Extract PAN from GST if the input length is sufficient
      const pan = value.length >= 12 ? value.substring(2, 12) : '';
      updatedFormData = {
        ...updatedFormData,
        comP_GST: value,
        comP_PANO: pan,
      };
    }
  
    // Handling Address concatenation for Registered Office
    if (name === 'comP_OAD1' || name === 'comP_OAD2' || name === 'comP_OAD3') {
      updatedFormData.comP_ADD = [updatedFormData.comP_OAD1, updatedFormData.comP_OAD2, updatedFormData.comP_OAD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // Handling Address concatenation for Factory Office
    if (name === 'comP_FAD1' || name === 'comP_FAD2' || name === 'comP_FAD3') {
      updatedFormData.comP_FADD = [updatedFormData.comP_FAD1, updatedFormData.comP_FAD2, updatedFormData.comP_FAD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    setFormData(updatedFormData);
    
    // Fetch cities if the state code changes
    if (name === 'statecode') {
      fetchCityGroups(updatedFormData.statecode);
    }

    setFormData(updatedFormData);
  
    // Clear validation errors if any
    setStatus(null);
    setValidationError(null);
    refresherror();
  };
  

  const handleEditFormChange = (event, rowCode) => {
    const { name, value } = event.target;
    
    // Create a copy of the existing editingRows
    let updatedRow = { ...editingRows[rowCode], [name]: value };
  
    if (name === 'comP_GST') {
      // GST-specific logic
      const stateCodePattern = /^[0-9]{2}/;
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}/;
      const suffixPattern = /^[1-9][A-Z]{2}$/;
  
      let errorMessage = '';
      if (value.length >= 2 && !stateCodePattern.test(value.slice(0, 2))) {
        errorMessage = 'GST number must start with two digits representing the state code.';
      } else if (value.length >= 12 && !panPattern.test(value.slice(2, 12))) {
        errorMessage = 'The GST number must contain a valid PAN in the middle (5 letters, 4 numbers, and 1 letter).';
      } else if (value.length >= 15 && !suffixPattern.test(value.slice(12, 15))) {
        errorMessage = 'The last three characters of the GST number should be alphanumeric, starting with a digit.';
      }
  
      setValidationErrorGSTedit(errorMessage);
  
      // Update the PAN based on GST number
      const pan = value.length >= 12 ? value.substring(2, 12) : '';
      updatedRow = { ...updatedRow, comP_GST: value, comP_PANO: pan };
    }
  
    // Concatenate Registered Address fields
    if (name === 'comP_OAD1' || name === 'comP_OAD2' || name === 'comP_OAD3') {
      updatedRow.comP_ADD = [updatedRow.comP_OAD1, updatedRow.comP_OAD2, updatedRow.comP_OAD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // Concatenate Factory Address fields
    if (name === 'comP_FAD1' || name === 'comP_FAD2' || name === 'comP_FAD3') {
      updatedRow.comP_FADD = [updatedRow.comP_FAD1, updatedRow.comP_FAD2, updatedRow.comP_FAD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // If statecode changes, reset city code and fetch new cities
    if (name === 'statecode') {
      updatedRow.comP_STATECODE = value;
      updatedRow.comP_CITYCODE = ''; // Reset city code when state changes
      fetchCityGroupsEdit(value); // Fetch cities for the selected state
    }
  
    // Update the editingRows state
    setEditingRows(prevRows => ({
      ...prevRows,
      [rowCode]: updatedRow,
    }));
    
    refresherror();
  };
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(validationcheckfields() === "error")
      { return; }
    formData.comP_STATECODE = formData.statecode;
    formData.comP_CITYCODE = formData.citycode;
    const { comp_acid_year, ...formDataWithoutYear } = formData;
    try {
      await axios.post(`${COMPMAST_URL_ENDPOINT}`, formDataWithoutYear, {
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
      await sleep(1000);
      setStatus(null);
      
      setValidationError(null);
    } 
    catch (error) {
      if (error.response && error.response.status === 400) {
        
        if (error.response.data === "A company with the same name already exists.") {
          setStatus({type: 'error', message: 'Comapny Name already in existing record.'} );
          
        } else {
          setValidationError('An error occurred. Please try again.');
        }
      } else {
        setValidationError('An error occurred. Please try again.');
      }
    }
  };

  const handleEditClick = (comp) => {
    refresherror();
    
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
    if(validationcheckfieldsedit(rowCode) === "error")
      { return; }
    const trimmedData = Object.fromEntries(
      Object.entries(editingRows[rowCode]).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    try {
      await axios.put(`${COMPMAST_URL_ENDPOINT}/${rowCode}`, trimmedData);
      await fetchCompMast();
      handleTabClose(rowCode);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("gussa")
        if (error.response.data === "A company with the same name already exists.") {
          setEditStatus((prevStatuses) => ({
            ...prevStatuses,
            [rowCode]: { type: 'error', message: 'Company Name already in existing record.' }
          }));
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
    setEditStatus(prevStatuses => ({
      ...prevStatuses,
      [rowCode]: null, // or delete prevStatuses[rowCode] if you prefer removing the key entirely
    }));
    
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
    setValidationErrorGST(null);
    refresherror();
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
    //setStatus(null);
    
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
                    error={!!validationErrorcheck?.name} helperText={validationErrorcheck?.name}
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
                          
                          error={!!validationErrorcheck?.fyyear} helperText={validationErrorcheck?.fyyear}
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
                    error={!!validationErrorcheck?.legname} helperText={validationErrorcheck?.legname}
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
                    error={!!validationErrorcheck?.roa1} helperText={validationErrorcheck?.roa1}
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
                    error={!!validationErrorcheck?.roa1} 
                   
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
                    error={!!validationErrorcheck?.roa1} 
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
                    error={!!validationErrorcheck?.foa1} helperText={validationErrorcheck?.foa1}
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
                    error={!!validationErrorcheck?.foa1}
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
                    error={!!validationErrorcheck?.foa1}
                  />
                </Grid>
                </Grid>
                <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}   paddingBottom={0.8}>
                <FormControl fullWidth variant="outlined" error={!!validationErrorcheck?.statecode}>
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
                    {validationErrorcheck?.statecod && (
                  <FormHelperText>{validationErrorcheck?.statecod}</FormHelperText>
                )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}  >
                <FormControl fullWidth variant="outlined" error={!!validationErrorcheck?.citycod}>
                    <InputLabel>Select City</InputLabel>
                    <Select
                      
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
                    {validationErrorcheck?.citycod && (
                  <FormHelperText>{validationErrorcheck?.citycod}</FormHelperText>
                )}
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
                    error={!!validationErrorcheck?.pinno} helperText={validationErrorcheck?.pinno}
                  />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="GST No" name="comP_GST" value={formData.comP_GST || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!ValidationErrorGST || !!validationErrorcheck?.gstn || !!validationErrorcheck?.gstlength } 
                  helperText={ValidationErrorGST || '' || validationErrorcheck?.gstn || validationErrorcheck?.gstlength} />
                  <TextField fullWidth label="PAN No" name="comP_PANO" value={formData.comP_PANO || ''} onChange={handleChange} variant="outlined" margin="dense" 
                 />
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
                    error={!!validationErrorcheck?.regdate} helperText={validationErrorcheck?.regdate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="comP_TANO" value={formData.comP_TANO || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.tanlength} helperText={validationErrorcheck?.tanlength} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="comP_CIN" value={formData.comP_CIN || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.cinlength} helperText={validationErrorcheck?.cinlength}/>
                  <TextField fullWidth label="MSME No" name="comP_MSMENO" value={formData.comP_MSMENO || ''} onChange={handleChange} variant="outlined" margin="dense"  error={!!validationErrorcheck?.msmelength} helperText={validationErrorcheck?.msmelength}/>
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
                <Typography variant="body2" color={status.type === 'success' ? 'green' : 'yellow'} style={{ marginTop: 10 }}>
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
                                'comP_PATH',
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

        {tabValue > 1 && tabs[tabValue] && (
          <form>
       <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>
                Company Master Details
              </Typography>
         <Grid container paddingTop={1}>
              <Grid item xs={12} sm={6} paddingBottom={0.8}>
                <TextField fullWidth label="Company Name" name="comP_NAME" value={editingRows[tabs[tabValue].code]?.comP_NAME || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.name} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.name} />
              </Grid>
              <Grid item xs={12} sm={2.1} paddingLeft={2}>
                <TextField fullWidth label="FY Starting" name="comP_ACID" type="datetime-local" value={editingRows[tabs[tabValue].code]?.comP_ACID || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={2.05} paddingLeft={2}>
                 <TextField fullWidth label="FY Starting" name="comP_ACFD" type="datetime-local" value={editingRows[tabs[tabValue].code]?.comP_ACFD || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={1.8}  paddingLeft={2}>
                 <TextField fullWidth label="Telephone" name="comP_TELE" value={editingRows[tabs[tabValue].code]?.comP_TELE || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" />    
              </Grid>
              <Grid item xs={12} sm={6} >
                <TextField fullWidth label="Legal Name" name="comP_FNAM" value={editingRows[tabs[tabValue].code]?.comP_FNAM || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.legname} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.legname} />
              </Grid>
              <Grid item xs={12} sm={3}  paddingInline={2} >
                <TextField fullWidth label="Email" name="comP_MAIL" value={editingRows[tabs[tabValue].code]?.comP_MAIL || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
              </Grid>
              <Grid item xs={12} sm={3} >
              <TextField fullWidth label="URL" name="comP_URL" value={editingRows[tabs[tabValue].code]?.comP_URL || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
              </Grid>
            </Grid>
            </Paper>
            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>
                Addresss Details
              </Typography>
            <Grid container paddingTop={1} >
             <Grid item xs={12} sm={4} paddingBottom={0.8} >
               <TextField fullWidth label="Registered Address line 1" name="comP_OAD1" value={editingRows[tabs[tabValue].code]?.comP_OAD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" multiline error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} />
              </Grid>
              <Grid item xs={12}  sm={4} paddingInline={2}>
                <TextField fullWidth label="Registered Address line 2" name="comP_OAD2" value={editingRows[tabs[tabValue].code]?.comP_OAD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" multiline error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} />
              </Grid>
              <Grid item xs={12} sm={4} >
                <TextField fullWidth label="Registered Address line 3" name="comP_OAD3" value={editingRows[tabs[tabValue].code]?.comP_OAD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" multiline error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} />
              </Grid>
            </Grid>
              <Grid container marginTop={1} >
               <Grid item xs={12}  sm={4}  paddingBottom={0.8}>
                 <TextField fullWidth label="Factory Office Address line 1" name="comP_FAD1" value={editingRows[tabs[tabValue].code]?.comP_FAD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1} />
                </Grid>
                <Grid item xs={12} sm={4} paddingInline={2}>
                <TextField fullWidth label="Factory Office Address line 2" name="comP_FAD2" value={editingRows[tabs[tabValue].code]?.comP_FAD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1} />
                </Grid>
                <Grid item xs={12} sm={4}  >
                <TextField fullWidth label="Factory Office Address line 3" name="comP_FAD3" value={editingRows[tabs[tabValue].code]?.comP_FAD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1} />
                </Grid>
              </Grid>
              <Grid container marginTop={1} >
                <Grid item xs={12}  sm={4}   paddingBottom={0.8}>
                <FormControl fullWidth variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.statecode}>
                    <InputLabel>Select State</InputLabel>
                    <Select
                        label="Select State"
                        name="statecode"
                        value={editingRows[tabs[tabValue].code]?.comP_STATECODE || ''}
                        onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
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
                    
                      label="Select City"
                      name="comP_CITYCODE"
                      value={editingRows[tabs[tabValue].code].comP_CITYCODE || ''}
                      disabled={!editingRows[tabs[tabValue].code].statecode}
                      onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                    >
                      {cityGroupsedit.length > 0 ? (
                        cityGroupsedit.map((city) => (
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
                <TextField fullWidth label="Pin" name="comP_PINCODE" value={editingRows[tabs[tabValue].code]?.comP_PINCODE || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.pinno} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.pinno} />
                </Grid>
                </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="GST No" name="comP_GST" value={editingRows[tabs[tabValue].code]?.comP_GST || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!ValidationErrorGSTedit || !!validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstn || !!validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstlength} helperText={ValidationErrorGSTedit || '' || validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstn || validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstlength} />
                <TextField fullWidth label="PAN No" name="comP_PANO" value={editingRows[tabs[tabValue].code]?.comP_PANO || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.pano} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.pano} />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Registration Date" name="comP_REGDATE" type="datetime-local" value={editingRows[tabs[tabValue].code]?.comP_REGDATE || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.regdate} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.regdate} InputLabelProps={{ shrink: true }} />
                <TextField fullWidth label="TAN No" name="comP_TANO" value={editingRows[tabs[tabValue].code]?.comP_TANO || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.tanlength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.tanlength} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="CIN No" name="comP_CIN" value={editingRows[tabs[tabValue].code]?.comP_CIN || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.cinlength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.cinlength} />
                <TextField fullWidth label="MSME No" name="comP_MSMENO" value={editingRows[tabs[tabValue].code]?.comP_MSMENO || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.msmelength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.msmelength} />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Previous Name (if any)" name="comP_PREVNAME" value={editingRows[tabs[tabValue].code]?.comP_PREVNAME || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" /> 
                    <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="comP_MSMESTAT"
                      value={editingRows[tabs[tabValue].code]?.comP_MSMESTAT || ''}
                      onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
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
                  <TextField fullWidth label="Bank Name" name="comP_BNKNAME" value={editingRows[tabs[tabValue].code]?.comP_BNKNAME || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />                  </Grid>
                  <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Bank RTGS Code" name="comP_BNKRTGS" value={editingRows[tabs[tabValue].code]?.comP_BNKRTGS || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Bank A/C No." name="comP_BNKAC" value={editingRows[tabs[tabValue].code]?.comP_BNKAC || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                  <TextField fullWidth label="Bank Address" name="comP_BNKADD" value={editingRows[tabs[tabValue].code]?.comP_BNKADD || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" multiline />
                  </Grid>
                </Grid>
                {editstatus[tabs[tabValue]?.code] && (
                  <Typography 
                    variant="body2" 
                    color={editstatus[tabs[tabValue]?.code].type === 'success' ? 'green' : 'yellow'} 
                    style={{ marginTop: 10 }}
                  >
                    {editstatus[tabs[tabValue]?.code].message}
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
