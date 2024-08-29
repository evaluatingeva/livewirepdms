import React, { useState } from 'react';
import { TextField, Grid, Button, Typography, Paper, FormControlLabel, Checkbox } from '@mui/material';

const DivisionMasterForm = () => {
  const [formData, setFormData] = useState({
    divisionName: '',
    note: '',
    orderAutoClear: '',
    excessLength: '',
    minimumLength: '',
    specificationRequired: false,
    shadeRequired: false,
    setWiseIssueRequired: false,
    screenRequired: false,
    shortageInFinishFabric: '',
    dyeSizeConversionCostDenim: '',
    dyeSizeConversionCostGrey: '',
    allowProductionWithoutRaw: false,
    gradeGroup: '',
    basicRate: '',
    netRate: '',
    hsnNo: '',
    hsnDescription: '',
    jobHsnNo: '',
    jobHsnDescription: ''
  });

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div style={{ padding: 1 }}>
      {/* Division Name */}
      <Paper style={{ padding: 16, marginBottom: 15 }}>
        <Grid container>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Division Name" 
              name="divisionName" 
              value={formData.divisionName} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Configuration Section */}
      <Paper style={{ padding: 16, marginBottom: 15 }}>
        <Typography variant="subtitle1" gutterBottom>Configuration</Typography>
        <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ color: 'red', fontSize: '1rem' }} // Adjust the fontSize as needed
        >
  Note: Apply only for Length based order
</Typography>

        {/* Configuration: General Fields */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Order Auto Clear" 
              name="orderAutoClear" 
              value={formData.orderAutoClear} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Allowable Excess Length Over D.O. Length during dispatch" 
              name="excessLength" 
              value={formData.excessLength} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Minimum Length (Meters) limit at the time of dispatch" 
              name="minimumLength" 
              value={formData.minimumLength} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>

        {/* Configuration: Checkboxes and Shortage in Finish Fabric */}
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.specificationRequired} 
                  onChange={handleChange} 
                  name="specificationRequired" 
                />
              } 
              label="Specification Required in Packing" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.shadeRequired} 
                  onChange={handleChange} 
                  name="shadeRequired" 
                />
              } 
              label="Shade Required in Packing" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.setWiseIssueRequired} 
                  onChange={handleChange} 
                  name="setWiseIssueRequired" 
                />
              } 
              label="Set wise Issue Required" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.screenRequired} 
                  onChange={handleChange} 
                  name="screenRequired" 
                />
              } 
              label="Screen Required" 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Shortage in Finish Fabric" 
              name="shortageInFinishFabric" 
              value={formData.shortageInFinishFabric} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>

        {/* Configuration: Conversion Costs and Grade Group */}
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Dye/SIZ Conversion Cost for Denim" 
              name="dyeSizeConversionCostDenim" 
              value={formData.dyeSizeConversionCostDenim} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Dye/SIZ Conversion Cost for Grey" 
              name="dyeSizeConversionCostGrey" 
              value={formData.dyeSizeConversionCostGrey} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.allowProductionWithoutRaw} 
                  onChange={handleChange} 
                  name="allowProductionWithoutRaw" 
                />
              } 
              label="Allow production without raw material?" 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Grade Group in Dispatch" 
              name="gradeGroup" 
              value={formData.gradeGroup} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Sales Order On: Basic Rate" 
              name="basicRate" 
              value={formData.basicRate} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Sales Order On: Net Rate" 
              name="netRate" 
              value={formData.netRate} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>
      </Paper>

      {/* HSN Information Section */}
      <Paper style={{ padding: 16, marginBottom: 20 }}>
        <Typography variant="subtitle1" gutterBottom>HSN Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="HSN No." 
              name="hsnNo" 
              value={formData.hsnNo} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="HSN Description" 
              name="hsnDescription" 
              value={formData.hsnDescription} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Job HSN No." 
              name="jobHsnNo" 
              value={formData.jobHsnNo} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Job HSN Description" 
              name="jobHsnDescription" 
              value={formData.jobHsnDescription} 
              onChange={handleChange} 
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Grid container spacing={2} justifyContent="flex-start">
        <Button variant="contained" color="primary" style={{ margin: 8 }}>Save</Button>
        <Button variant="contained" color="secondary" style={{ margin: 8 }}>Cancel</Button>
        <Button variant="contained" style={{ backgroundColor: '#FFA726', margin: 8 }}>Edit</Button>
        <Button variant="contained" color="error" style={{ margin: 8 }}>Delete</Button>
        <Button variant="contained" style={{ backgroundColor: '#BDBDBD', margin: 8 }}>Exit</Button>
      </Grid>
    </div>
  );
};

export default DivisionMasterForm;
