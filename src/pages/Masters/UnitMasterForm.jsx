import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import { UNITMASTER_URL_ENDPOINT, COMPMAST_URL_ENDPOINT, STATEMASTER_URL_ENDPOINT, CITYMASTER_URL_ENDPOINT } from '../../utils/url_endpoints';
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UnitMasterForm = () => {
  const [createFormData, setCreateFormData] = useState({
    comp: "0001",
    code: "5",
    name: "",
    fadd: "Sample Address",
    phno: "",
    emal: "",
    url: "",
    tano: "",
    pano: "",
    blno: "",
    dfaD1: "",
    dfaD2: "",
    dfaD3: "",
    extrA1: "Extra1",
    extrA2: "Extra2",
    extrA3: "Extra3",
    extrA4: "Extra4",
    extrA5: "Extra5",
    logo: "0x48656C6C6F2C20576F726C6421",
    logoBase64: null,
    insdet: "Sample Instruction",
    invhead: "Sample Invoice Header",
    noti: "Sample Notification",
    active: "Y",
    pkgver: "FAS",
    cinno: "",
    ofaD1: "",
    ofaD2: "",
    ofaD3: "",
    isexportunit: "S",
    sign: "0x48656C6C6F2C20576F726C6421",
    citycod: "",
    dpF_ADD: 0,
    adD_ACOM: "Additional Comment",
    adD_SUP: "Support Information",
    adD_DCOM: "Description Comment",
    rmK1: "Remark 1",
    rmK2: "Remark 2",
    rmK3: "Remark 3",
    shortname: "",
    gstn: "",
    statecode: "",
    statecod: "",
    pinno: "",
    citycode: "",
    bankdeT1: "",
    bankdeT2: "",
    bankdeT3: "",
    bankdeT4: "",
    regdate: "",
    msmeno: "",
    msmestat: "",
    legname: "",
    compara: ""
  });

  const [editFormData, setEditFormData] = useState(null);
  const [status, setStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Unit Details' }]);
  const [units, setUnits] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [importFromCompanyMaster, setImportFromCompanyMaster] = useState(false);
  const [cityGroups, setCityGroups] = useState([]);
  const [states, setStates] = useState([]);

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
    setCreateFormData((prevData) => ({
      ...prevData,
      gstn: value,
      pano: pan
    }));
  };

  const fetchCityGroups = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      const filteredCities = response.data.filter(city => city.statecode === createFormData.statecode);
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

  useEffect(() => {
    fetchStates();
    if (tabValue === 1) {
      fetchUnits();
    }
  }, [tabValue]);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`${UNITMASTER_URL_ENDPOINT}`);
      setUnits(response.data);
    } catch (error) {
      console.error("Error fetching units", error);
    }
  };

  const handleImportFromCompanyMaster = async () => {
    try {
      const response = await axios.get(`${COMPMAST_URL_ENDPOINT}/0009`); // Ensure the ID is correct
      const companyData = response.data;

      setCreateFormData(prevFormData => ({
        ...prevFormData,
        ofaD1: companyData.comP_OAD1 || '',
        ofaD2: companyData.comP_OAD2 || '',
        ofaD3: companyData.comP_OAD3 || '',
        dfaD1: companyData.comP_FAD1 || '',
        dfaD2: companyData.comP_FAD2 || '',
        dfaD3: companyData.comP_FAD3 || '',
        phno: companyData.comP_TELE || '',
        emal: companyData.comP_MAIL || '',
        url: companyData.comP_URL || '',
        pano: companyData.comP_PANO || '',
        tano: companyData.comP_TANO || '',
        statecode: companyData.comP_STATECODE || '',
        citycode: companyData.comP_CITYCODE || '',
        pinno: companyData.comP_PINCODE || '',
        gstn: companyData.comP_GST || '',
        msmeno: companyData.comP_MSMENO || '',
        msmestat: companyData.comP_MSMESTAT || '',
        bankdeT1: companyData.comP_BNKNAME || '',
        bankdeT2: companyData.comP_BNKRTGS || '',
        bankdeT3: companyData.comP_BNKAC || '',
        bankdeT4: companyData.comP_BNKADD || '',
        cinno: companyData.comP_CIN || ''
      }));
    } catch (error) {
      console.error("Error importing company data", error);
    }
  };

  useEffect(() => {
    if (importFromCompanyMaster) {
      handleImportFromCompanyMaster();
    } else {
      setCreateFormData({
        comp: "0001",
        code: "5",
        name: "",
        fadd: "Sample Address",
        phno: "",
        emal: "",
        url: "",
        tano: "",
        pano: "",
        blno: "",
        dfaD1: "",
        dfaD2: "",
        dfaD3: "",
        extrA1: "Extra1",
        extrA2: "Extra2",
        extrA3: "Extra3",
        extrA4: "Extra4",
        extrA5: "Extra5",
        logo: "0x48656C6C6F2C20576F726C6421",
        logoBase64: null,
        insdet: "Sample Instruction",
        invhead: "Sample Invoice Header",
        noti: "Sample Notification",
        active: "Y",
        pkgver: "FAS",
        cinno: "",
        ofaD1: "",
        ofaD2: "",
        ofaD3: "",
        isexportunit: "S",
        sign: "0x48656C6C6F2C20576F726C6421",
        citycod: "",
        dpF_ADD: 0,
        adD_ACOM: "Additional Comment",
        adD_SUP: "Support Information",
        adD_DCOM: "Description Comment",
        rmK1: "Remark 1",
        rmK2: "Remark 2",
        rmK3: "Remark 3",
        shortname: "",
        gstn: "",
        statecode: "",
        statecod: "",
        pinno: "",
        citycode: "",
        bankdeT1: "",
        bankdeT2: "",
        bankdeT3: "",
        bankdeT4: "",
        regdate: "",
        msmeno: "",
        msmestat: "",
        legname: "",
        compara: ""
      });
    }
  }, [importFromCompanyMaster]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === 'importFromCompanyMaster') {
      setImportFromCompanyMaster(checked);
    } else {
      if (tabValue === 0) {
        setCreateFormData({ ...createFormData, [name]: type === 'checkbox' ? checked : value });
      } else if (tabValue > 1) {
        const updatedEditFormData = { ...editingRows[tabs[tabValue].code], [name]: type === 'checkbox' ? checked : value };
        setEditingRows({
          ...editingRows,
          [tabs[tabValue].code]: updatedEditFormData,
        });
      }
    }

    if (name === 'gstn') {
      handleGstChange(value);
    } else {
      setCreateFormData({ ...createFormData, [name]: type === 'checkbox' ? checked : value });
    }


    if (name === 'statecode') {
      createFormData.statecode = value;
      fetchCityGroups();
    }

    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validationError) {
      setStatus({ type: 'error', message: 'Please fix the errors before submitting.' });
      return;
    }

    try {
      await axios.post(`${UNITMASTER_URL_ENDPOINT}`, createFormData, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      setStatus({ type: 'success', message: 'Unit added successfully!' });
      handleCancel();
      fetchUnits();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add unit.' });
    }
  };

  const handleDelete = async (endpoint, comp, code, name, setItems, items, setEditingRows = null) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the item with the name: ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        focusCancel: true,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${endpoint}/${comp}/${code}`);
        if (response.status >= 200 && response.status < 300) {
          setItems(items.filter((item) => item.code !== code));
          MySwal.fire('Deleted!', `Item with name: ${name} has been deleted.`, 'success');
        } else {
          throw new Error(`Failed to delete. Server responded with status: ${response.status}`);
        }
      } else {
        if (setEditingRows) {
          setEditingRows(null);
        }
      }
    } catch (error) {
      console.error("Error deleting item", error.message);
      MySwal.fire('Error!', `Failed to delete the item: ${error.message}`, 'error');
    }
  };

  const handleEditClick = (unit) => {
    const editTabExists = tabs.some(tab => tab.label === `Edit ${unit.name}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${unit.name}`, code: unit.code }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${unit.name}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);

    setEditingRows({
      ...editingRows,
      [unit.code]: unit,
    });
  };

  const handleUpdateClick = async (rowCode) => {
    try {
      await axios.put(`${UNITMASTER_URL_ENDPOINT}/${editingRows[rowCode].comp}/${editingRows[rowCode].code}`, editingRows[rowCode]);
      await fetchUnits();
      handleTabClose(rowCode);
    } catch (error) {
      console.error("Error updating unit", error);
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
    setCreateFormData({
      comp: "0001",
      code: "5",
      name: "",
      fadd: "Sample Address",
      phno: "",
      emal: "",
      url: "",
      tano: "",
      pano: "",
      blno: "",
      dfaD1: "",
      dfaD2: "",
      dfaD3: "",
      extrA1: "Extra1",
      extrA2: "Extra2",
      extrA3: "Extra3",
      extrA4: "Extra4",
      extrA5: "Extra5",
      logo: "0x48656C6C6F2C20576F726C6421",
      logoBase64: null,
      insdet: "Sample Instruction",
      invhead: "Sample Invoice Header",
      noti: "Sample Notification",
      active: "Y",
      pkgver: "FAS",
      cinno: "",
      ofaD1: "",
      ofaD2: "",
      ofaD3: "",
      isexportunit: "S",
      sign: "0x48656C6C6F2C20576F726C6421",
      citycod: "",
      dpF_ADD: 0,
      adD_ACOM: "Additional Comment",
      adD_SUP: "Support Information",
      adD_DCOM: "Description Comment",
      rmK1: "Remark 1",
      rmK2: "Remark 2",
      rmK3: "Remark 3",
      shortname: "",
      gstn: "",
      statecode: "",
      statecod: "",
      pinno: "",
      citycode: "",
      bankdeT1: "",
      bankdeT2: "",
      bankdeT3: "",
      bankdeT4: "",
      regdate: "",
      msmeno: "",
      msmestat: "",
      legname: "",
      compara: ""
    });
    setValidationError(null);
  };

  const handleEdit = () => {
    const editTabExists = tabs.some(tab => tab.label === 'Edit Units');
    if (!editTabExists) {
      const newTabLabel = `Edit Units`;
      setTabs([...tabs, { label: newTabLabel }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === 'Edit Units');
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setEditingRows(null);
      setCreateFormData({
        comp: "0001",
        code: "5",
        name: "",
        fadd: "Sample Address",
        phno: "",
        emal: "",
        url: "",
        tano: "",
        pano: "",
        blno: "",
        dfaD1: "",
        dfaD2: "",
        dfaD3: "",
        extrA1: "Extra1",
        extrA2: "Extra2",
        extrA3: "Extra3",
        extrA4: "Extra4",
        extrA5: "Extra5",
        logo: "0x48656C6C6F2C20576F726C6421",
        logoBase64: null,
        insdet: "Sample Instruction",
        invhead: "Sample Invoice Header",
        noti: "Sample Notification",
        active: "Y",
        pkgver: "FAS",
        cinno: "",
        ofaD1: "",
        ofaD2: "",
        ofaD3: "",
        isexportunit: "S",
        sign: "0x48656C6C6F2C20576F726C6421",
        citycod: "",
        dpF_ADD: 0,
        adD_ACOM: "Additional Comment",
        adD_SUP: "Support Information",
        adD_DCOM: "Description Comment",
        rmK1: "Remark 1",
        rmK2: "Remark 2",
        rmK3: "Remark 3",
        shortname: "",
        gstn: "",
        statecode: "",
        statecod: "",
        pinno: "",
        citycode: "",
        bankdeT1: "",
        bankdeT2: "",
        bankdeT3: "",
        bankdeT4: "",
        regdate: "",
        msmeno: "",
        msmestat: "",
        legname: "",
        compara: ""
      });
      setStatus(null);
      setValidationError(null);
    }
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
                Unit Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={importFromCompanyMaster}
                        onChange={(event) => setImportFromCompanyMaster(event.target.checked)}
                        name="importFromCompanyMaster"
                        color="primary"
                      />
                    }
                    label="Import from Company Master"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Unit Name" name="name" value={createFormData.name || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={createFormData.ofaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={createFormData.ofaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={createFormData.ofaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={createFormData.dfaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={createFormData.dfaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={createFormData.dfaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} marginTop={1}> 
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select State</InputLabel>
                    <Select
                      label="Select State"
                      name="statecode"
                      value={createFormData.statecode || ''}
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
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      label="Select City"
                      name="citycode"
                      value={createFormData.citycode || ''}
                      disabled={!createFormData.statecode}
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
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="PIN" name="pinno" value={createFormData.pinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Phone" name="phno" value={createFormData.phno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Email" name="emal" value={createFormData.emal || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="URL" name="url" value={createFormData.url || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="GST No" 
                  name="gstn" 
                  value={createFormData.gstn || ''} 
                  onChange={handleChange} 
                  variant="outlined" 
                  margin="dense" 
                  error={!!validationError} 
                  helperText={validationError || ''}
                />                 
                <TextField fullWidth label="PAN No" name="pano" value={createFormData.pano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="regdate"
                    type="datetime-local"
                    value={createFormData.regdate || ''}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={createFormData.tano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={createFormData.cinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="msmeno" value={createFormData.msmeno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Short Name" name="shortname" value={createFormData.shortname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="msmestat"
                      value={createFormData.msmestat || ''}
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
                    <TextField fullWidth label="Bank Name" name="bankdeT1" value={createFormData.bankdeT1} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="bankdeT2" value={createFormData.bankdeT2} onChange={handleChange} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="bankdeT3" value={createFormData.bankdeT3} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="bankdeT4" value={createFormData.bankdeT4} onChange={handleChange} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
              
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Other Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Legal Name" name="legname" value={createFormData.legname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Parameter" name="compara" value={createFormData.compara || ''} onChange={handleChange} variant="outlined" margin="dense" />
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
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <Table stickyHeader sx={{ minWidth: 650, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Unit Name</StyledTableCell>
                    <StyledTableCell>MSME Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {units.map((unit) => (
                    <StyledTableRow key={unit.code}>
                      <StyledTableCell>{unit.name}</StyledTableCell>
                      <StyledTableCell>{unit.msmestat}</StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" justifyContent="center">
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-customEdit"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(unit)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-outlinedError"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(
                              UNITMASTER_URL_ENDPOINT,
                              unit.comp,
                              unit.code,
                              unit.name,
                              setUnits,
                              units,
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

        {tabValue > 1 && editingRows[tabs[tabValue].code] && (
          <form>
            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>
                Unit Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Unit Name" name="name" value={editingRows[tabs[tabValue].code].name || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={editingRows[tabs[tabValue].code].ofaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={editingRows[tabs[tabValue].code].ofaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={editingRows[tabs[tabValue].code].ofaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={editingRows[tabs[tabValue].code].dfaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={editingRows[tabs[tabValue].code].dfaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={editingRows[tabs[tabValue].code].dfaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select State</InputLabel>
                    <Select
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
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      label="Select City"
                      name="citycode"
                      value={editingRows[tabs[tabValue].code].citycode || ''}
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
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="PIN" name="pinno" value={editingRows[tabs[tabValue].code].pinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Phone" name="phno" value={editingRows[tabs[tabValue].code].phno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Email" name="emal" value={editingRows[tabs[tabValue].code].emal || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="URL" name="url" value={editingRows[tabs[tabValue].code].url || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="GST No" name="gstn" value={editingRows[tabs[tabValue].code].gstn || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="PAN No" name="pano" value={editingRows[tabs[tabValue].code].pano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="regdate"
                    type="datetime-local"
                    value={editingRows[tabs[tabValue].code].regdate || ''}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={editingRows[tabs[tabValue].code].tano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={editingRows[tabs[tabValue].code].cinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="msmeno" value={editingRows[tabs[tabValue].code].msmeno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Short Name" name="shortname" value={editingRows[tabs[tabValue].code].shortname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="msmestat"
                      value={editingRows[tabs[tabValue].code].msmestat || ''}
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
                    <TextField fullWidth label="Bank Name" name="bankdeT1" value={editingRows[tabs[tabValue].code].bankdeT1 || ''} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="bankdeT2" value={editingRows[tabs[tabValue].code].bankdeT2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="bankdeT3" value={editingRows[tabs[tabValue].code].bankdeT3 || ''}onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="bankdeT4" value={editingRows[tabs[tabValue].code].bankdeT4 || ''} onChange={handleChange} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Other Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Legal Name" name="legname" value={editingRows[tabs[tabValue].code].legname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Parameter" name="compara" value={editingRows[tabs[tabValue].code].compara || ''} onChange={handleChange} variant="outlined" margin="dense" />
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

export default UnitMasterForm;
