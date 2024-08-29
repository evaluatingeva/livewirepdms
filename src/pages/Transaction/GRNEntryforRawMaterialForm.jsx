import React, { useState, useMemo } from 'react';
import { TextField, Grid, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const GRNEntryForm = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierChnNo: '',
    supplierBillNo: '',
    chlnDate: '',
    billDate: '',
    grnNo: '',
    grnDate: '',
    taxReference: '',
    currency: '',
    exRate: '',
    taxType: 'NONE',
    retailtaxinv: '',
    items: [],
    lrNo: '',
    lrDate: '',
    godown: '',
    gateNo: '',
    gateDate: '',
    nameOfTransport: '',
    vehicleNo: '',
    remark: '',
    totalCarton: '',
    totalQuantity: '',
    grossAmount: '',
    netAmount: '',
    valuationRate: '',
    discount: '',
    freight: '',
    insurance: '',
    cGST: '',
    sGST: '',
    iGST: '',
    tCS: '',
    effectInCost: 'N',
    returnablePallet: false
  });

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index][name] = value;

      if (name === 'rate' || name === 'quantity') {
        const rate = parseFloat(newItems[index].rate) || 0;
        const quantity = parseFloat(newItems[index].quantity) || 0;
        newItems[index].amount = (rate * quantity).toFixed(2);
      }

      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({ ...formData, [event.target.name]: value });
    }
  };
  const handleTaxTypeChange = (event) => {
    setFormData({ ...formData, taxType: event.target.value });
  };

  const handleAddItem = () => {
    const newItem = { item: '', mergeNo: '', grade: '', cops: '', pieces: '', quantity: '', rate: '', amount: '0.00' };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: newItems });
  };

  const totalCarton = useMemo(() => formData.items.length, [formData.items]);
  const totalQuantity = useMemo(() => formData.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0), [formData.items]);
  const grossAmount = useMemo(() => formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0), [formData.items]);

  return (
    <Box sx={{ padding: 1, maxWidth: '1800px', margin: 'auto' }}>
      <Paper elevation={3} sx={{ padding: 2, margin: 0, marginBottom: 3, border: 1 }}>
        <Typography variant="subtitle1">Supplier Information</Typography>
        <Grid container spacing={0.7} border={'black'}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth label="Supplier Name" value={formData.supplierName} onChange={(e) => handleChange(e)} name="supplierName" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="GRN No." value={formData.grnNo} onChange={(e) => handleChange(e)} name="grnNo" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Supplier Chln No." value={formData.supplierChnNo} onChange={(e) => handleChange(e)} name="supplierChnNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="Supplier Bill No." value={formData.supplierBillNo} onChange={(e) => handleChange(e)} name="supplierBillNo" variant="outlined" margin="dense" />
            <TextField fullWidth label="Tax Reference" value={formData.taxReference} onChange={(e) => handleChange(e)} name="taxReference" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Chln Date" type="date" value={formData.chlnDate} onChange={(e) => handleChange(e)} name="chlnDate" InputLabelProps={{ shrink: true }} margin="dense" />
            <TextField fullWidth label="Bill Date" type="date" value={formData.billDate} onChange={(e) => handleChange(e)} name="billDate" InputLabelProps={{ shrink: true }} margin="dense" />
            <TextField fullWidth label="Retail/Tax Inv." value={formData.retailtaxinv} onChange={(e) => handleChange(e)} name="retailtaxinv" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="GRN Date" type="date" value={formData.grnDate} onChange={(e) => handleChange(e)} name="grnDate" InputLabelProps={{ shrink: true }} margin="dense" />
            <FormControl fullWidth margin="dense">
              <InputLabel>Tax Type</InputLabel>
              <Select
                value={formData.taxType}
                onChange={handleTaxTypeChange}
                name="taxType"
                label="Tax Type"
              >
                <MenuItem value="NONE">None</MenuItem>
                <MenuItem value="GST">GST</MenuItem>
                <MenuItem value="VAT">VAT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Currency" value={formData.currency} onChange={(e) => handleChange(e)} name="currency" variant="outlined" margin="dense" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Exchange Rate" value={formData.exRate} onChange={(e) => handleChange(e)} name="exRate" variant="outlined" margin="dense" />
          </Grid>
        </Grid>
      </Paper>

      {/* Item Details */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, border: 1, borderColor: 'black', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Item Details</Typography>
        <Button 
          onClick={handleAddItem} 
          variant="contained" 
          color="primary" 
          sx={{ marginBottom: 2, textTransform: 'none' }}
        >
          Add Item
        </Button>
        <TableContainer component={Paper} sx={{ borderRadius: 0, border: '0px solid', borderColor: 'grey.300' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.600', borderRadius: 2, border: '2px solid', borderColor: 'black.100' }}>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Item Name</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Merge No.</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Grade</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Cops</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Pieces</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Quantity</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Rate</strong></TableCell>
                <TableCell align="center" sx={{ borderRight: '1px solid black' }}><strong>Amount</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.items.map((item, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.400' }, '&:nth-of-type(even)': { backgroundColor: 'grey.500' } }}>
                  {Object.keys(item).map((key) => (
                    <TableCell key={key} sx={{ borderRight: '1px solid black' }}>
                      <TextField
                        variant="standard"
                        value={item[key]}
                        onChange={(e) => handleChange(e, index)}
                        name={key}
                        fullWidth
                        InputProps={{ disableUnderline: true, sx: { fontSize: 14 } }}
                        sx={{ backgroundColor: 'white', paddingX: 1 }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button 
                      color="error" 
                      onClick={() => handleRemoveItem(index)} 
                      sx={{ textTransform: 'none' }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ padding: 2, border: '1px solid black' }}>
              <Typography>Total Carton</Typography>
              <Typography variant="h8" sx={{ marginTop: 1 }}>{totalCarton}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ padding: 2, border: '1px solid black' }}>
              <Typography>Total Quantity</Typography>
              <Typography variant="h8" sx={{ marginTop: 1 }}>{totalQuantity.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ padding: 2, border: '1px solid black' }}>
              <Typography>Gross Amount</Typography>
              <Typography variant="h8" sx={{ marginTop: 1 }}>{grossAmount.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Transport Details */}
      <Paper elevation={3} sx={{ padding: 2, margin: 0, marginBottom: 3, border: 1 }}>
        <Typography variant="subtitle1">Transport Details</Typography>
        <Grid container spacing={0.7} border={'black'}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="L.R. No" name="lrNo" value={formData.lrNo} onChange={handleChange} variant="outlined" margin="dense" />
            <TextField type="date" fullWidth label="L.R. Date" name="lrDate" value={formData.lrDate} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" margin="dense"  />
            <TextField fullWidth label="Godown" name="godown" value={formData.godown} onChange={handleChange} variant="outlined" margin="dense"  />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Gate No." name="gateNo" value={formData.gateNo} onChange={handleChange} variant="outlined" margin="dense"  />
            <TextField type="date" fullWidth label="Gate Date" name="gateDate" value={formData.gateDate} onChange={handleChange} InputLabelProps={{ shrink: true }} variant="outlined" margin="dense"  />
            <TextField fullWidth label="Name of Transport" name="nameOfTransport" value={formData.nameOfTransport} onChange={handleChange} variant="outlined" margin="dense"  />
            <TextField fullWidth label="Vehicle No." name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} variant="outlined" margin="dense"  />
            <TextField fullWidth label="Remark" name="remark" value={formData.remark} onChange={handleChange} variant="outlined" margin="dense"  />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">Save</Button>
          <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }}>Cancel</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GRNEntryForm;
