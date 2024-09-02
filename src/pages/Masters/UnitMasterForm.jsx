import React, { useState, useEffect } from 'react';
import { FormHelperText,TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
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
    CC:"",
    SC:"",
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
  const [editstatus, setEditStatus] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [validationErrorcheck, setValidationErrorcheck] = useState(null);
  const [validationErrorcheckedit, setValidationErrorcheckedit] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Unit Details' }]);
  const [units, setUnits] = useState([]);
  const [editingRows, setEditingRows] = useState({});
  const [importFromCompanyMaster, setImportFromCompanyMaster] = useState(false);
  const [cityGroups, setCityGroups] = useState([]);
  const [cityGroupsedit, setCityGroupsedit] = useState([]);
  const [states, setStates] = useState([]);
  const [ValidationErrorGST, setValidationErrorGST  ] = useState(null);
  const [ValidationErrorGSTedit, setValidationErrorGSTedit  ] = useState(null);
  
  const refresherror = () => {
    setValidationErrorcheck(null);
    setValidationErrorcheckedit(null);
    //setValidationErrorcheckedit(null);
  };

  const validationcheckfields = () =>{
    let errors = {};
    if (!formData.name) errors.name = 'Unit Name cannot be blank';
    if (!formData.dfaD1 || !formData.dfaD2 ||!formData.dfaD3) errors.foa1 = 'Complete Factory adress Required fill all three textbox of factory address';
    if (!formData.ofaD1 || !formData.ofaD2 ||!formData.ofaD3) errors.roa1 = 'Complete Registered adress Required fill all three textbox of registered address';
    if (formData.pinno && !/^\d{6}$/.test(formData.pinno)) { errors.pinno = 'PIN Number must be exactly 6 digits';}
    if (!formData.pano) errors.pano = 'PAN cannot be blank';
    if (!formData.gstn) errors.gstn = 'GST Number cannot be blank';
    if (formData.gstn && formData.gstn.length !== 15) errors.gstlength = 'GST Should be of 15 characters';
    if (!formData.regdate) errors.regdate = 'Registration Date cannot be blank';
    if (!formData.legname) errors.legname = 'Legal Name cannot be blank';
    if (!formData.pinno) errors.pinno = 'PIN Number cannot be blank';
    if (!formData.CC) errors.CC = 'City Code cannot be blank';
    if (!formData.SC) errors.SC = 'State Code cannot be blank';
    if (formData.cinno && formData.cinno.length !== 21) errors.cinlength = 'CIN Should be of 21 charcaters';
    if (formData.tano && formData.tano.length !== 10) errors.tanlength = 'TAN Should be of 10 charcaters';
    if (formData.msmeno && formData.msmeno.length !== 19) errors.msmelength = 'MSME Number Should be of 19 charcaters';
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

  if (!row.name) errors.name = 'Unit Name cannot be blank';
  if (!row.dfaD1 || !row.dfaD2 || !row.dfaD3) errors.foa1 = 'Complete Factory address required; fill all three textboxes of factory address';
  if (!row.ofaD1 || !row.ofaD2 || !row.ofaD3) errors.roa1 = 'Complete Registered address required; fill all three textboxes of registered address';
  if (row.pinno && !/^\d{6}$/.test(row.pinno)) errors.pinno = 'PIN Number must be exactly 6 digits';
  if (!row.pinno) errors.pinno = 'PIN Number cannot be blank';
  if (!row.pano) errors.pano = 'PAN cannot be blank';
  if (!row.gstn) errors.gstn = 'GST Number cannot be blank';
  if (row.gstn && row.gstn.length !== 15) errors.gstlength = 'GST Should be of 15 characters';
  if (!row.regdate) errors.regdate = 'Registration Date cannot be blank';
  if (!row.legname) errors.legname = 'Legal Name cannot be blank';
  if (!row.citycode) errors.citycod = 'City Code cannot be blank';
  if (!row.statecode) errors.statecode = 'State Code cannot be blank';
  if (row.cinno && row.cinno.length !== 21) errors.cinlength = 'CIN Should be of 21 characters';
  if (row.tano && row.tano.length !== 10) errors.tanlength = 'TAN Should be of 10 characters';
  if (row.msmeno && row.msmeno.length !== 19) errors.msmelength = 'MSME Number should be of 19 characters';
 
  if (Object.keys(errors).length > 0) {
    console.log('Validation Errors:');
    for (const [field, message] of Object.entries(errors)) {
      console.log(`${field}: ${message}`);
    }
  }
  setValidationErrorcheckedit((prevErrors) => ({
    ...prevErrors,
    [rowCode]: errors
  }));

  if (Object.keys(errors).length > 0) {
    return "error";
  }
};


  const fetchCityGroups = async (statecode) => {
    try {
      const response = await axios.get(CITYMASTER_URL_ENDPOINT);
      const filteredCities = response.data.filter(city => city.statecode === statecode);
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
      const trimmedData = response.data.map(comp => 
        Object.fromEntries(
          Object.entries(comp).map(([key, value]) => [
            key,
            typeof value === 'string' ? value.trim() : value,
          ])
        )
      );
      setUnits(trimmedData);
    } catch (error) {
      console.error("Error fetching units", error);
    }
  };

  const handleImportFromCompanyMaster = async () => {
    refresherror();
    try {
      const response = await axios.get(`${COMPMAST_URL_ENDPOINT}/0022`); // Ensure the ID is correct
      const companyData = response.data;
      fetchCityGroups(companyData.comP_STATECODE);
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
        SC: companyData.comP_STATECODE || '',
        CC: companyData.comP_CITYCODE || '',
        pinno: companyData.comP_PINCODE || '',
        gstn: companyData.comP_GST || '',
        msmeno: companyData.comP_MSMENO || '',
        msmestat: companyData.comP_MSMESTAT || '',
        bankdeT1: companyData.comP_BNKNAME || '',
        bankdeT2: companyData.comP_BNKRTGS || '',
        bankdeT3: companyData.comP_BNKAC || '',
        bankdeT4: companyData.comP_BNKADD || '',
        cinno: companyData.comP_CIN || '',
        legname: companyData.comP_FNAM || '',
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
        CC:"",
        SC:"",
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
    } 
    
    else {
        setFormData({ ...formData, 
          [name]: type === 'checkbox' ? checked : value, 
        });
    }
    let updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
  
    // GST-specific validation and update logic
    if (name === 'gstn') {
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
      const pano = value.length >= 12 ? value.substring(2, 12) : '';
      updatedFormData = {
        ...updatedFormData,
        gstn: value,
        pano: pano,
      };
    }
  
    // Handling Address concatenation for Factory Office
    if (name === 'dfaD1' || name === 'dfaD2' || name === 'dfaD3') {
      updatedFormData.fadd = [updatedFormData.dfaD1, updatedFormData.dfaD2, updatedFormData.dfaD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // Fetch cities if the state code changes
    if (name === 'SC') {
      fetchCityGroups(updatedFormData.SC);
    }
  
    setFormData(updatedFormData);
  
    // Clear validation errors if any
    setStatus(null);
    setValidationError(null);
    refresherror();
  };

  const handleEditFormChange = (event, rowCode) => {
    const { name, value } = event.target;
  
    // Create a copy of the existing editingRows and update the specific field
    let updatedRow = { ...editingRows[rowCode], [name]: value };
  
    // Handle special case for GST number
    if (name === 'gstn') {
      // GST-specific validation and PAN extraction
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
      updatedRow = { ...updatedRow, gstn: value, pano: pan };
    }
  
    // Concatenate Factory Address fields
    if (name === 'dfaD1' || name === 'dfaD2' || name === 'dfaD3') {
      updatedRow.fadd = [updatedRow.dfaD1, updatedRow.dfaD2, updatedRow.dfaD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // Concatenate Registered Address fields
    if (name === 'ofaD1' || name === 'ofaD2' || name === 'ofaD3') {
      updatedRow.radd = [updatedRow.ofaD1, updatedRow.ofaD2, updatedRow.ofaD3]
        .filter(part => part && part.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  
    // If state code changes, reset city code and fetch new cities
    if (name === 'SC') {
      updatedRow.statecode = value;
      updatedRow.citycode = ''; // Reset city code when state changes
      fetchCityGroupsEdit(value); // Fetch cities for the selected state
    }
  
    // Update the editingRows state
    setEditingRows(prevRows => ({
      ...prevRows,
      [rowCode]: updatedRow,
    }));
  
    refresherror(); // Clear any existing errors
    setEditStatus(prevStatuses => ({
      ...prevStatuses,
      [rowCode]: null, // or delete prevStatuses[rowCode] if you prefer removing the key entirely
    })); // Clear edit status
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(validationcheckfields() === "error")
      { return; }
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
      STATECODE: formData.SC,
      STATECOD: formData.statecod,
      PINNO: formData.pinno,
      CITYCODE: formData.CC,
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
          CC:"",
           SC:"",
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
        setValidationError(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === "A unit with the same name already exists within the same company.") {
          setStatus({type: "error" ,message:'Unit Name already in use.'});
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
    refresherror();
    setValidationError(null);
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


    if(validationcheckfieldsedit(rowCode) === "error")
      { return; }
    const editedunit ={
      COMP: '0001',
      CODE: rowCode,
      NAME: editingRows[rowCode].name.trim(),
      FADD: "Sample Address",
      PHNO: editingRows[rowCode].phno.trim(),
      EMAL: editingRows[rowCode].emal.trim(),
      URL: editingRows[rowCode].url.trim(),
      TANO: editingRows[rowCode].tano.trim(),
      PANO: editingRows[rowCode].pano.trim(),
      BLNO: editingRows[rowCode].blno.trim(),
      DFAD1: editingRows[rowCode].dfaD1.trim(),
      DFAD2: editingRows[rowCode].dfaD2.trim(),
      DFAD3: editingRows[rowCode].dfaD3.trim(),
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
      CINNO: editingRows[rowCode].cinno.trim(),
      OFAD1: editingRows[rowCode].ofaD1.trim(),
      OFAD2: editingRows[rowCode].ofaD2.trim(),
      OFAD3: editingRows[rowCode].ofaD3.trim(),
      ISEXPORTUNIT: "S",
      SIGN: "0x48656C6C6F2C20576F726C6421",
      CITYCOD: editingRows[rowCode].citycod.trim(),
      DPF_ADD: 0,
      ADD_ACOM: "Additional Comment",
      ADD_SUP: "Support Information",
      ADD_DCOM: "Description Comment",
      RMK1: "Remark 1",
      RMK2: "Remark 2",
      RMK3: "Remark 3",
      SHORTNAME: editingRows[rowCode].shortname.trim(),
      GSTN: editingRows[rowCode].gstn.trim(),
      STATECODE: editingRows[rowCode].statecode.trim(),
      STATECOD: editingRows[rowCode].statecod.trim(),
      PINNO: editingRows[rowCode].pinno.trim(),
      CITYCODE: editingRows[rowCode].citycode.trim(),
      BANKDET1: editingRows[rowCode].bankdeT1.trim(),
      BANKDET2: editingRows[rowCode].bankdeT2.trim(),
      BANKDET3: editingRows[rowCode].bankdeT3.trim(),
      BANKDET4: editingRows[rowCode].bankdeT4.trim(),
      REGDATE: editingRows[rowCode].regdate.trim(),
      MSMENO: editingRows[rowCode].msmeno.trim(),
      MSMESTAT: editingRows[rowCode].msmestat.trim(),
      LEGNAME: editingRows[rowCode].legname.trim(),
      COMPARA: editingRows[rowCode].compara.trim(),

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
        if (error.response.data === "A unit with the same name already exists in Record.") {       
          setEditStatus((prevStatuses) => ({
            ...prevStatuses,
            [rowCode]: { type: 'error', message: 'Unit Name already in existing record.' }
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
    //refresherror();
  };

  const handleTabClose = (rowCode) => {
    const tabIndex = tabs.findIndex(tab => tab.code === rowCode);
    setTabs(tabs.filter(tab => tab.code !== rowCode));
    setEditingRows(prevRows => {
      const { [rowCode]: _, ...remainingRows } = prevRows;
      return remainingRows;
    });
    setTabValue(1);
    //refresherror();
  };

  const handleCancel = () => {
    setFormData({
      CC:"",
    SC:"",
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
    setImportFromCompanyMaster(false);
    setStatus(null);
    setValidationError(null);
    refresherror();
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
                  <TextField fullWidth label="Unit Name" name="name" value={formData.name || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.name} helperText={validationErrorcheck?.name}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={formData.ofaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.roa1} helperText={validationErrorcheck?.roa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={formData.ofaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.roa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={formData.ofaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.roa1}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={formData.dfaD1 || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.foa1} helperText={validationErrorcheck?.foa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={formData.dfaD2 || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.foa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={formData.dfaD3 || ''} onChange={handleChange} variant="outlined" margin="dense" error={!!validationErrorcheck?.foa1}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} marginTop={1}> 
                  <FormControl fullWidth variant="outlined" error={!!validationErrorcheck?.SC}>
                    <InputLabel>Select State</InputLabel>
                    <Select
                      label="Select State"
                      name="SC"
                      value={formData.SC || ''}
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
                    {validationErrorcheck?.SC && (
                  <FormHelperText>{validationErrorcheck?.SC}</FormHelperText>
                )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined" error={!!validationErrorcheck?.CC}>
                    <InputLabel>Select City</InputLabel>
                    <Select
                      label="Select City"
                      name="CC"
                      value={formData.CC || ''}
                      disabled={!formData.SC}
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
                    {validationErrorcheck?.CC && (
                  <FormHelperText>{validationErrorcheck?.CC}</FormHelperText>
                )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="PIN" name="pinno" value={formData.pinno || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.pinno} helperText={validationErrorcheck?.pinno}/>
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
                  error={!!ValidationErrorGST || !!validationErrorcheck?.gstn || !!validationErrorcheck?.gstlength } 
                  helperText={ValidationErrorGST || '' || validationErrorcheck?.gstn || validationErrorcheck?.gstlength}
                />                 
                <TextField fullWidth label="PAN No" name="pano" value={formData.pano || ''} onChange={handleChange} variant="outlined" margin="dense"  error={!!validationErrorcheck?.pano} helperText={validationErrorcheck?.pano}/>
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
                    error={!!validationErrorcheck?.regdate} helperText={validationErrorcheck?.regdate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={formData.tano || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.tanlength} helperText={validationErrorcheck?.tanlength}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={formData.cinno || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.cinlength} helperText={validationErrorcheck?.cinlength}/>
                  <TextField fullWidth label="MSME No" name="msmeno" value={formData.msmeno || ''} onChange={handleChange} variant="outlined" margin="dense" 
                  error={!!validationErrorcheck?.msmelength} helperText={validationErrorcheck?.msmelength}/>
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
                  <TextField fullWidth label="Legal Name" name="legname" value={formData.legname || ''} onChange={handleChange} variant="outlined" margin="dense"  error={!!validationErrorcheck?.legname} helperText={validationErrorcheck?.legname}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Parameter" name="compara" value={formData.compara || ''} onChange={handleChange} variant="outlined" margin="dense" />
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
                  <TextField fullWidth label="Unit Name" name="name" value={editingRows[tabs[tabValue].code].name || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense"
                   error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.name } helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.name }/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 1" name="ofaD1" value={editingRows[tabs[tabValue].code].ofaD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense"
                   error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 2" name="ofaD2" value={editingRows[tabs[tabValue].code].ofaD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Registered Office Address 3" name="ofaD3" value={editingRows[tabs[tabValue].code].ofaD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense"  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.roa1}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 1" name="dfaD1" value={editingRows[tabs[tabValue].code].dfaD1 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 2" name="dfaD2" value={editingRows[tabs[tabValue].code].dfaD2 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Factory Address 3" name="dfaD3" value={editingRows[tabs[tabValue].code].dfaD3 || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.foa1}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined" error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.statecode}>
                    <InputLabel>Select State</InputLabel>
                    <Select
                      label="Select State"
                      name="SC"
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
                    {validationErrorcheckedit?.[tabs[tabValue]?.code]?.statecod && (
                  <FormHelperText>{validationErrorcheckedit?.[tabs[tabValue]?.code]?.statecod}</FormHelperText>
                )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} marginTop={1}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      label="Select City"
                      name="citycode"
                      value={editingRows[tabs[tabValue].code].citycode || ''}
                      disabled={!editingRows[tabs[tabValue].code].SC}
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
                  <TextField fullWidth label="PIN" name="pinno" value={editingRows[tabs[tabValue].code].pinno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.pinno} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.pinno}/>
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
                  <TextField fullWidth label="GST No" name="gstn" value={editingRows[tabs[tabValue].code].gstn || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                    error={!!ValidationErrorGSTedit || !!validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstn|| !!validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstlength} 
                    helperText={ValidationErrorGSTedit || '' || validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstn || validationErrorcheckedit?.[tabs[tabValue]?.code]?.gstlength}/>
                  <TextField fullWidth label="PAN No" name="pano" value={editingRows[tabs[tabValue].code].pano || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                    error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.pano} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.pano}/>
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
                    error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.regdate} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.regdate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField fullWidth label="TAN No" name="tano" value={editingRows[tabs[tabValue].code].tano || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.tanlength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.tanlength}/>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="CIN No" name="cinno" value={editingRows[tabs[tabValue].code].cinno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.cinlength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.cinlength}/>
                  <TextField fullWidth label="MSME No" name="msmeno" value={editingRows[tabs[tabValue].code].msmeno || ''} onChange={(event) => handleEditFormChange(event, tabs[tabValue].code)} variant="outlined" margin="dense" 
                  error={!!validationErrorcheckedit?.[tabs[tabValue]?.code]?.msmelength} helperText={validationErrorcheckedit?.[tabs[tabValue]?.code]?.msmelength}/>
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

export default UnitMasterForm;
