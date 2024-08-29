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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const UnitMasterForm = () => {
  const [formData, setFormData] = useState({
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

  const [status, setStatus] = useState(null);
  const [editstatus, setEditStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Unit Details' }]);
  const [units, setUnits] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [importFromCompanyMaster, setImportFromCompanyMaster] = useState(false);
  const [cityGroups, setCityGroups] = useState([]);
  const [cityGroupsedit, setCityGroupsedit] = useState([]);
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
    setFormData((prevData) => ({
      ...prevData,
      gstn: value,
      pano: pan
    }));
  };

  const fetchCityGroups = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      const filteredCities = response.data.filter(city => city.statecode === formData.statecode);
      setCityGroups(filteredCities);
    } catch (error) {
      console.error("Error fetching City records", error);
    }
  };

  const fetchCityGroupsNORMAL = async () => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      console.log('Fetched City records:', response.data);
      setCityGroupsedit(response.data);
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
    } catch (error) {
      console.error("Error fetching states", error);
    }
  };

  useEffect(() => {
    fetchStates();
    if (tabValue === 1) {
      fetchUnits();
    }
    if(tabValue>1){ fetchStates();
      fetchCityGroupsNORMAL();}
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

      setFormData(prevFormData => ({
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
      setFormData({
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
        setFormData({ ...formData, 
          [name]: type === 'checkbox' ? checked : value, 
        });
    }
    if (name === 'gstn') {
      handleGstChange(value);
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
    if (name === 'statecode') {
      formData.statecode = value;
      fetchCityGroups();
    }
    setStatus(null);
    setEditStatus(null);
    setValidationError(null);
  };

  const handleEditFormChange = (event, rowCode) => {
    const { name, value } = event.target;
  
    // Ensure all fields are preserved and only the specific field is updated
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [rowCode]: {
        ...prevEditingRows[rowCode],
        [name]: value,
      },
    }));
  
    // Handle special case for GST number
    if (name === 'gstn') {
      handleGstChange(value);
    }
    let updatedEditFormData = {
      ...editingRows,
      [rowCode]: {
        ...editingRows[rowCode],
        [name]: value,
      },
    };
    // If state code is changed, fetch corresponding cities
    if (name === 'statecode') {
      updatedEditFormData[rowCode].statecode = value;
      updatedEditFormData[rowCode].comP_STATECODE = value;
      setEditingRows({
        ...editingRows,
        [rowCode]: updatedEditFormData[rowCode],
      });
      // Pass the state code directly to fetchCityGroups
      fetchCityGroupsEdit(value);// Fetch cities based on the new state code
    }
  
    setEditStatus(null);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validationError) {
      setStatus({ type: 'error', message: 'Please fix the errors before submitting.' });
      return;
    }
    const newUnit= {
      COMP: formData.comp,
      CODE: formData.code,
      NAME: formData.name,
      FADD: formData.fadd,
      PHNO: formData.phno,
      EMAL: formData.emal,
      URL: formData.url,
      TANO: formData.tano,
      PANO: formData.pano,
      BLNO: formData.blno,
      DFAD1: formData.dfaD1,
      DFAD2: formData.dfaD2,
      DFAD3: formData.dfaD3,
      EXTRA1: formData.extrA1,
      EXTRA2: formData.extrA2,
      EXTRA3: formData.extrA3,
      EXTRA4: formData.extrA4,
      EXTRA5: formData.extrA5,
      LOGO: formData.logo,
      LOGOBASE64: formData.logoBase64,
      INSDET: formData.insdet,
      INVHEAD: formData.invhead,
      NOTI: formData.noti,
      ACTIVE: formData.active,
      PKGVER: formData.pkgver,
      CINNO: formData.cinno,
      OFAD1: formData.ofaD1,
      OFAD2: formData.ofaD2,
      OFAD3: formData.ofaD3,
      ISEXPORTUNIT: formData.isexportunit,
      SIGN: formData.sign,
      CITYCOD: formData.citycod,
      DPF_ADD: formData.dpF_ADD,
      ADD_ACOM: formData.adD_ACOM,
      ADD_SUP: formData.adD_SUP,
      ADD_DCOM: formData.adD_DCOM,
      RMK1: formData.rmK1,
      RMK2: formData.rmK2,
      RMK3: formData.rmK3,
      SHORTNAME: formData.shortname,
      GSTN: formData.gstn,
      STATECODE: formData.statecode,
      STATECOD: formData.statecod,
      PINNO: formData.pinno,
      CITYCODE: formData.citycode,
      BANKDET1: formData.bankdeT1,
      BANKDET2: formData.bankdeT2,
      BANKDET3: formData.bankdeT3,
      BANKDET4: formData.bankdeT4,
      REGDATE: formData.regdate,
      MSMENO: formData.msmeno,
      MSMESTAT: formData.msmestat,
      LEGNAME: formData.legname,
      COMPARA: formData.compara,
    };
    try {
      const response = await axios.post(`${UNITMASTER_URL_ENDPOINT}`, newUnit, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 201){
        setStatus({ type: 'success', message: 'Unit added successfully!' });
        setFormData({
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
        await sleep(1000);
        setStatus(null);
        setEditStatus(null);
        setValidationError(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "Unit Name already in use.") {
          setValidationError('Unit Name already in use.');
        } else {
          setValidationError('An error occurred. Please try again.');
        }
      } else {
        setValidationError('An error occurred. Please try again.');
      }
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
    const newEditingRows = { ...editingRows, [unit.code]: unit };
    setEditingRows(newEditingRows);
  
    const editTabExists = tabs.some(tab => tab.label === `Edit ${unit.name}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${unit.name}`, code: unit.code }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${unit.name}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
  };
  

  const handleUpdateClick = async (rowCode) => {
    const editedunit ={
      COMP: '0001',
      CODE: rowCode,
      NAME: editingRows[rowCode].name,
      FADD: "Sample Address",
      PHNO: editingRows[rowCode].phno,
      EMAL: editingRows[rowCode].emal,
      URL: editingRows[rowCode].url,
      TANO: editingRows[rowCode].tano,
      PANO: editingRows[rowCode].pano,
      BLNO: editingRows[rowCode].blno,
      DFAD1: editingRows[rowCode].dfaD1,
      DFAD2: editingRows[rowCode].dfaD2,
      DFAD3: editingRows[rowCode].dfaD3,
      EXTRA1: "Extra1",
      EXTRA2: "Extra2",
      EXTRA3: "Extra3",
      EXTRA4: "Extra4",
      EXTRA5: "Extra5",
      LOGO: "0x48656C6C6F2C20576F726C6421",
      LOGOBASE64: null,
      INSDET: "Sample Instruction",
      INVHEAD: "Sample Invoice Header",
      NOTI: "Sample Notification",
      ACTIVE: "Y",
      PKGVER: "FAS",
      CINNO: editingRows[rowCode].cinno,
      OFAD1: editingRows[rowCode].ofaD1,
      OFAD2: editingRows[rowCode].ofaD2,
      OFAD3: editingRows[rowCode].ofaD3,
      ISEXPORTUNIT: "S",
      SIGN: "0x48656C6C6F2C20576F726C6421",
      CITYCOD: editingRows[rowCode].citycod,
      DPF_ADD: 0,
      ADD_ACOM: "Additional Comment",
      ADD_SUP: "Support Information",
      ADD_DCOM: "Description Comment",
      RMK1: "Remark 1",
      RMK2: "Remark 2",
      RMK3: "Remark 3",
      SHORTNAME: editingRows[rowCode].shortname,
      GSTN: editingRows[rowCode].gstn,
      STATECODE: editingRows[rowCode].statecode,
      STATECOD: editingRows[rowCode].statecod,
      PINNO: editingRows[rowCode].pinno,
      CITYCODE: editingRows[rowCode].citycode,
      BANKDET1: editingRows[rowCode].bankdeT1,
      BANKDET2: editingRows[rowCode].bankdeT2,
      BANKDET3: editingRows[rowCode].bankdeT3,
      BANKDET4: editingRows[rowCode].bankdeT4,
      REGDATE: editingRows[rowCode].regdate,
      MSMENO: editingRows[rowCode].msmeno,
      MSMESTAT: editingRows[rowCode].msmestat,
      LEGNAME: editingRows[rowCode].legname,
      COMPARA: editingRows[rowCode].compara,

    }
    try {
      const response = await axios.put(`${UNITMASTER_URL_ENDPOINT}/${editingRows[rowCode].comp}/${editingRows[rowCode].code}`, editedunit, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 204) {
        await fetchUnits();
        handleTabClose(rowCode);
        setValidationError(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "Unit Name already in existing record.") {
          setEditStatus({ type: 'error', message: 'Unit Name already in existing record.' });
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
    setEditStatus(null);
    setValidationError(null);
  };

  const handleEdit = () => {
    const listTabExists = tabs.some(tab => tab.label === 'Unit Master List');
    if (!listTabExists) {
      setTabs([...tabs, { label: 'Unit Master List' }]);
    }
    const listTabIndex = tabs.findIndex(tab => tab.label === 'Unit Master List');
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
              <Typography variant="subtitle1" gutterBottom>Unit Details</Typography>
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
                  <TextField fullWidth label="Unit Name" name="name" value={formData.name || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={formData.ofaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={formData.ofaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={formData.ofaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={formData.dfaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={formData.dfaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={formData.dfaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} marginTop={1}> 
                  <FormControl fullWidth variant="outlined">
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="PIN" name="pinno" value={formData.pinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Phone" name="phno" value={formData.phno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Email" name="emal" value={formData.emal || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="URL" name="url" value={formData.url || ''} onChange={handleChange} variant="outlined" margin="dense" />
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
                  value={formData.gstn || ''} 
                  onChange={handleChange} 
                  variant="outlined" 
                  margin="dense" 
                  error={!!validationError} 
                  helperText={validationError || ''}
                />                 
                <TextField fullWidth label="PAN No" name="pano" value={formData.pano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="regdate"
                    type="datetime-local"
                    value={formData.regdate || ''}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={formData.tano || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={formData.cinno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="msmeno" value={formData.msmeno || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Short Name" name="shortname" value={formData.shortname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="msmestat"
                      value={formData.msmestat || ''}
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
                    <TextField fullWidth label="Bank Name" name="bankdeT1" value={formData.bankdeT1} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="bankdeT2" value={formData.bankdeT2} onChange={handleChange} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="bankdeT3" value={formData.bankdeT3} onChange={handleChange} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="bankdeT4" value={formData.bankdeT4} onChange={handleChange} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
              
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Other Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Legal Name" name="legname" value={formData.legname || ''} onChange={handleChange} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Parameter" name="compara" value={formData.compara || ''} onChange={handleChange} variant="outlined" margin="dense" />
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
            <Typography variant="subtitle1" gutterBottom>Unit Master List</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 4000, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
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
              <Typography variant="subtitle1" gutterBottom>Edit Record</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Unit Name" name="name" value={editingRows[tabs[tabValue].code].name || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={editingRows[tabs[tabValue].code].ofaD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={editingRows[tabs[tabValue].code].ofaD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={editingRows[tabs[tabValue].code].ofaD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={editingRows[tabs[tabValue].code].dfaD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={editingRows[tabs[tabValue].code].dfaD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={editingRows[tabs[tabValue].code].dfaD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
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
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      label="Select City"
                      name="citycode"
                      value={editingRows[tabs[tabValue].code].citycode || ''}
                      disabled={!editingRows[tabs[tabValue].code].comP_STATECODE}
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
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="PIN" name="pinno" value={editingRows[tabs[tabValue].code].pinno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Phone" name="phno" value={editingRows[tabs[tabValue].code].phno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Email" name="emal" value={editingRows[tabs[tabValue].code].emal || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="URL" name="url" value={editingRows[tabs[tabValue].code].url || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Financial Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="GST No" name="gstn" value={editingRows[tabs[tabValue].code].gstn || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  <TextField fullWidth label="PAN No" name="pano" value={editingRows[tabs[tabValue].code].pano || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Date"
                    name="regdate"
                    type="datetime-local"
                    value={editingRows[tabs[tabValue].code].regdate || ''}
                    onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)}
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={editingRows[tabs[tabValue].code].tano || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={editingRows[tabs[tabValue].code].cinno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  <TextField fullWidth label="MSME No" name="msmeno" value={editingRows[tabs[tabValue].code].msmeno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Short Name" name="shortname" value={editingRows[tabs[tabValue].code].shortname || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>MSME Status</InputLabel>
                    <Select
                      label="MSME Status"
                      name="msmestat"
                      value={editingRows[tabs[tabValue].code].msmestat || ''}
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
                    <TextField fullWidth label="Bank Name" name="bankdeT1" value={editingRows[tabs[tabValue].code].bankdeT1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense"/>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank RTGS Code" name="bankdeT2" value={editingRows[tabs[tabValue].code].bankdeT2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Bank A/C No." name="bankdeT3" value={editingRows[tabs[tabValue].code].bankdeT3 || ''}onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense"/>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <TextField fullWidth label="Bank Addresss" name="bankdeT4" value={editingRows[tabs[tabValue].code].bankdeT4 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" multiline/>
                  </Grid>
                </Grid>
            </Paper>

            <Paper style={{ padding: 16, marginBottom: 20 }}>
              <Typography variant="subtitle1" gutterBottom>Other Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Legal Name" name="legname" value={editingRows[tabs[tabValue].code].legname || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Parameter" name="compara" value={editingRows[tabs[tabValue].code].compara || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" />
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
