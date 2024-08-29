import React, { useState } from 'react';
import { TextField, Grid, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

const ConsigneeAddressMaster = () => {
  const [formData, setFormData] = useState({
    address1: '',
    address2: '',
    address3: '',
    area: '',
    state: '',
    phoneNo: '',
    eccNo: '',
    lstNo: '',
    cstNo: '',
    gstNo: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAddAddress = () => {
    // Check if all fields are filled
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');

    if (isFormValid) {
      setAddresses([...addresses, formData]);
      setFormData({
        address1: '',
        address2: '',
        address3: '',
        area: '',
        state: '',
        phoneNo: '',
        eccNo: '',
        lstNo: '',
        cstNo: '',
        gstNo: '',
      });
      setError(''); // Clear any previous error
    } else {
      setError('Please fill out all fields before adding the address.');
    }
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = addresses.filter((_, idx) => idx !== index);
    setAddresses(newAddresses);
  };

  return (
    <Box sx={{ padding: 1, maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <Paper elevation={3} sx={{ paddingLeft: 2,paddingTop: 2,paddingBottom: 2,   margin: 0, marginBottom: 3, border: 1 }}>
        
          <Typography variant="h6" gutterBottom >Party - Consignee Address Master</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ padding: 2, margin: 0, marginBottom: 1,}}  >
            <TextField fullWidth label="Consignee" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={6}  sx={{ padding: 2, margin: 0, marginBottom: 3, borderTop: 1,borderBottom: 1,borderLeft:1}} >
            <TextField fullWidth label="Address 1" value={formData.address1} onChange={handleChange} name="address1" variant="outlined" margin="dense" />
            <TextField fullWidth label="Address 2" value={formData.address2} onChange={handleChange} name="address2" variant="outlined" margin="dense" />
            <TextField fullWidth label="Address 3" value={formData.address3} onChange={handleChange} name="address3" variant="outlined" margin="dense" />
            <TextField fullWidth label="Area" value={formData.area} onChange={handleChange} name="area" variant="outlined" margin="dense" />
            <TextField fullWidth label="State" value={formData.state} onChange={handleChange} name="state" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={6}  sx={{ padding: 2, margin: 0, marginBottom: 3, borderTop: 1,borderBottom: 1,borderRight:1 }}>
            <TextField fullWidth label="Phone No." value={formData.phoneNo} onChange={handleChange} name="phoneNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="Ecc No." value={formData.eccNo} onChange={handleChange} name="eccNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="LST No." value={formData.lstNo} onChange={handleChange} name="lstNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="CST No." value={formData.cstNo} onChange={handleChange} name="cstNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="GST No." value={formData.gstNo} onChange={handleChange} name="gstNo" variant="outlined" margin="dense" />
          </Grid>
        </Grid>
        <Box mt={2} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleAddAddress} sx={{ marginRight: 2 }}>Add</Button>
        
        </Box>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, margin: 0, marginBottom: 3, border: 1 }}>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 1220 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.600',backgroundColor: 'grey.600', borderRadius: 2, border: '2px solid', borderColor: 'black.100'  }} >
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>Address</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>Phone Number</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>Ecc No.</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>CST No.</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>LST No.</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>GST No.</strong></TableCell>
              <TableCell sx={{ borderRight: '1px solid black' }}><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address, index) => (
              <TableRow key={index}>
                <TableCell sx={{ borderRight: '1px solid black' }}>{`${address.address1}, ${address.address2}, ${address.address3}, ${address.area}, ${address.state}`}</TableCell>
                <TableCell sx={{ borderRight: '1px solid black' }}>{address.phoneNo}</TableCell>
                <TableCell sx={{ borderRight: '1px solid black' }}>{address.eccNo}</TableCell>
                <TableCell sx={{ borderRight: '1px solid black' }}>{address.cstNo}</TableCell>
                <TableCell sx={{ borderRight: '1px solid black' }}>{address.lstNo}</TableCell>
                <TableCell sx={{ borderRight: '1px solid black' }}>{address.gstNo}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleRemoveAddress(index)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </Box>
  );
};

export default ConsigneeAddressMaster;
