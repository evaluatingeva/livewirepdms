import React, { useState } from 'react';
import { TextField, Grid, Button, Typography, Paper, FormControlLabel, Checkbox, Tabs, Tab, Box, AppBar } from '@mui/material';
import { Rotate90DegreesCwOutlined } from '@mui/icons-material';
import { Select, MenuItem, InputAdornment } from '@mui/material';
import CustomButtons from '../CustomButtons';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const AccountForm = () => {
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        group: '',
        contactPerson: '',
        regdOffice1: '',
        regdOffice2: '',
        regdOffice3: '',
        state: '',
        city: '',
        pinNo: '',
        phone: '',
        mobileNo: '',
        faxNo: '',
        permanentAddress1: '',
        permanentAddress2: '',
        shortName: '',
        webURL: '',
        email: '',
        panNo: '',
        gstNo: '',
        rateMasterAllow: false,
        tdsDeclarationReceived: false,
        typeofaccount: '',
        rateperclick: '',
        c: '',
        broker: '',
        area: '',
        groupcompany: '',
        taxcategory: '',
        companytype: '',
        categoryforsaletaxpurpose: '',
        lsttinno: '',
        csttinno: '',
        range: '',
        div: '',
        commissionrate: '',
        iecno: '',
        eccno: '',
        tanno: '',
        bankname: '',
        bankaccountno: '',
        rtgscode: '',
        servicetaxno: '',
        remarkifany: ''

    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="account tabs">
                    <Tab label="Account / Reference Information" {...a11yProps(0)} />
                    <Tab label="Other Information" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
                    <Typography variant="h6" gutterBottom>Account Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Select
                                        value={formData.name}
                                        onChange={handleChange}
                                        name="name"
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value="">
                                            <em>Select Name</em>
                                        </MenuItem>
                                        <MenuItem value="Name1">Name1</MenuItem>
                                        <MenuItem value="Name2">Name2</MenuItem>
                                    </Select>
                                </InputAdornment>
                                 ),
                             }}
                        />                            
                            <TextField fullWidth label="Group" name="group" value={formData.group} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Registered Office Address" name="regdOffice1" value={formData.regdOffice1} onChange={handleChange} variant="outlined" multiline rows={3} margin="dense" />
                            <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="PIN No." name="pinNo" value={formData.pinNo} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} variant="outlined" margin="dense"/>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Fax No." name="faxNo" value={formData.faxNo} onChange={handleChange} variant="outlined" margin="dense" />
                                </Grid>
                                <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel 
                                        control={<Checkbox checked={formData.rateMasterAllow} onChange={handleChange} name="rateMasterAllow" />}
                                        label="Rate Master Allow?"
                                        style={{ marginLeft: 0 }}
                                    />
                                </Grid>
                        </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Permanent Address" name="regdOffice1" value={formData.regdOffice1} onChange={handleChange} variant="outlined" multiline rows={3} margin="dense" />
                            <TextField fullWidth label="Short Name (Max 12 characters)" name="shortName" value={formData.shortName} onChange={handleChange} variant="outlined" margin="dense" inputProps={{ maxLength: 12 }} />
                            <TextField fullWidth label="Web URL" name="webURL" value={formData.webURL} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="E-Mail" name="email" value={formData.email} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="PAN No." name="panNo" value={formData.panNo} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="GST No." name="gstNo" value={formData.gstNo} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField
                                fullWidth
                                label="Type of Account"
                                name="typeofaccount"
                                value={formData.typeofaccount}
                                onChange={handleChange}
                                variant="outlined"
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Select
                                                value={formData.typeofaccount}
                                                onChange={handleChange}
                                                name="typeofaccount"
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Account</em>
                                                </MenuItem>
                                                <MenuItem value="Registered">Registered</MenuItem>
                                                <MenuItem value="Composition">Composition</MenuItem>
                                                <MenuItem value="UIN">UIN</MenuItem>
                                                <MenuItem value="Consumer">Consumer</MenuItem>
                                                <MenuItem value="Importer">Importer</MenuItem>
                                                <MenuItem value="Exporter">Exporter</MenuItem>
                                            </Select>
                                        </InputAdornment>
                                    ),
                                }}
                            />                            
                            <TextField fullWidth label="Rate per Click" name="rateperclick" value={formData.rateperclick} onChange={handleChange} variant="outlined" margin="dense"/>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Field C" name="c" value={formData.c} onChange={handleChange} variant="outlined" margin="dense"/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Field D" name="d" value={formData.d} onChange={handleChange} variant="outlined" margin="dense"/>
                                </Grid>
                            </Grid>
                            <FormControlLabel 
                                control={<Checkbox checked={formData.tdsDeclarationReceived} onChange={handleChange} name="tdsDeclarationReceived" />}
                                label={<span>TDS Declaration Received?<br />[Sale/Debtors]</span>}
                                style={{ marginTop: '8px' }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
                    <Typography variant="h6" gutterBottom>Reference Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Broker" name="broker" value={formData.broker} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Area" name="area" value={formData.area} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Group Company" name="groupcompany" value={formData.groupcompany} onChange={handleChange} variant="outlined" margin="dense"/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Tax Category" name="taxcategory" value={formData.taxcategory} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField fullWidth label="Company Type" name="companytype" value={formData.companytype} onChange={handleChange} variant="outlined" margin="dense"/>
                            <TextField
                                fullWidth
                                label="Category for Sale Tax Purpose"
                                name="categoryforsaletaxpurpose"
                                value={formData.categoryforsaletaxpurpose}
                                onChange={handleChange}
                                variant="outlined"
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Select
                                                value={formData.categoryforsaletaxpurpose}
                                                onChange={handleChange}
                                                name="categoryforsaletaxpurpose"
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Category</em>
                                                </MenuItem>
                                                <MenuItem value="Retail Invoice">Retail Invoice</MenuItem>
                                                <MenuItem value="Tax Invoice">Tax Invoice</MenuItem>
                                            </Select>
                                        </InputAdornment>
                                     ),
                                 }}
                            />                        
                            </Grid>
                    </Grid>
                </Paper>
                      {/* Buttons */}
                      <CustomButtons />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Paper style={{ padding: 16, marginBottom: 20 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="LST TIN No." name="lsttinno" value={formData.lsttinno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="CST TIN No." name="csttinno" value={formData.csttinno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Range" name="range" value={formData.range} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Div" name="div" value={formData.div} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Commission Rate" name="commissionrate" value={formData.commissionrate} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="IEC No." name="iecno" value={formData.iecno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="ECC No." name="eccno" value={formData.eccno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="TAN No." name="tanno" value={formData.tanno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Bank Name" name="bankname" value={formData.bankname} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Bank Account No." name="bankaccountno" value={formData.bankaccountno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="RTGS Code" name="rtgscode" value={formData.rtgscode} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Service Tax No." name="servicetaxno" value={formData.servicetaxno} onChange={handleChange} variant="outlined" margin="dense"/>
                        <TextField fullWidth label="Remark if any" name="remarkifany" value={formData.remarkifany} onChange={handleChange} variant="outlined" margin="dense"/>
                    </Grid>
                </Paper>
                      {/* Buttons */}
                      <CustomButtons />
                {/* Other Information Tab Content */}
            </TabPanel>
        </div>
    );
}

export default AccountForm;
