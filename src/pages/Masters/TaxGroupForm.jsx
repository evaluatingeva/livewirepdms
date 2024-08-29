import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import { TAXGRPMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler';
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';  // Import the styled components




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




const TaxGroupForm = () => {
  const [formData, setFormData] = useState({
    taxgroupname: '',
    deactivate: false,
  });




  const [status, setStatus] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [validationErroredit, setValidationErroredit] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tabs, setTabs] = useState([{ label: 'Tax Group Details' }]);
  const [taxGroups, setTaxGroups] = useState([]);
  const [editingRows, setEditingRows] = useState({});




  useEffect(() => {
    if (tabValue === 1) {
      fetchTaxGroups();
    }
  }, [tabValue]);




  const [createFormData, setCreateFormData] = useState({
    taxgroupname: '',
  });




  const fetchTaxGroups = async () => {
    try {
      const response = await axios.get(`${TAXGRPMASTER_URL_ENDPOINT}`);
      console.log('Fetched Tax Groups:', response.data);
      setTaxGroups(response.data);
    } catch (error) {
      console.error("Error fetching tax groups", error);
    }
  };




  const handleChange = (event, rowCode) => {
    const { name, value, type, checked } = event.target;
    setEditingRows({
      ...editingRows,
      [rowCode]: {
        ...editingRows[rowCode],
        [name]: type === 'checkbox' ? checked : value,
      },
    });
    setStatus(null);
    setValidationError(null);
    setValidationErroredit(null);
  };




  const handleSubmit = async (event) => {
    event.preventDefault();




    // Validation for empty field
    if (!createFormData.taxgroupname) {
      setValidationError('Tax Group Name is required');
      return;
    }




    // Validation for character limit
    if (createFormData.taxgroupname.trim().length > 20) {
      setValidationError('Tax Group Name cannot exceed 20 characters');
      return;
    }




    try {
      const response = await axios.post(`${TAXGRPMASTER_URL_ENDPOINT}`, {
        CODE: "",
        NAME: createFormData.taxgroupname.trim(),
        RECSTAT: "A"
      }, {
        headers: {
          'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
          'Content-Type': 'application/json'
        }
      });
      setValidationError(null);




      if (response.status === 201) {
        setStatus({ type: 'success', message: 'Tax Group added successfully!' });
        await fetchTaxGroups();
        setCreateFormData({ taxgroupname: '' });
        await sleep(1000);
        setStatus(null);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add Tax Group.' });
    }
  };




  const handleEditClick = (group) => {
    const newEditingRows = { ...editingRows };
    if (!newEditingRows[group.code]) {
      newEditingRows[group.code] = {
        taxgroupname: group.name.trim(),
        deactivate: group.recstat === 'D',
      };
    }
    setEditingRows(newEditingRows);




    const editTabExists = tabs.some(tab => tab.label === `Edit ${group.name}`);
    if (!editTabExists) {
      setTabs([...tabs, { label: `Edit ${group.name}`, code: group.code }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${group.name}`);
    setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
  };




  const handleUpdateClick = async (rowCode) => {


    if (!editingRows[rowCode].taxgroupname.trim()) {
      setValidationErroredit('Tax Group Name is required');
      return;
    }




    // Validation for character limit
    if (editingRows[rowCode].taxgroupname.trim().length > 20) {
      setValidationErroredit('Tax Group Name cannot exceed 20 characters');
      return;
    }
    const updatedGroup = {
      code: rowCode,
      name: editingRows[rowCode].taxgroupname.trim(),
      recstat: editingRows[rowCode].deactivate ? 'D' : 'A',
    };




    try {
      await axios.put(`${TAXGRPMASTER_URL_ENDPOINT}/${rowCode}`, updatedGroup);
      setTaxGroups(taxGroups.map(g => g.code === rowCode ? updatedGroup : g));
      handleTabClose(rowCode);
    } catch (error) {
      console.error("Error updating tax group", error);
    }
  };




  const handleCancelUpdateClick = (rowCode) => {
    handleTabClose(rowCode);
    setValidationError(null);
    setValidationErroredit(null);
  };




  const handleTabClose = (rowCode) => {
    const tabIndex = tabs.findIndex(tab => tab.code === rowCode);
    setTabs(tabs.filter(tab => tab.code !== rowCode));
    setEditingRows(prevRows => {
      const { [rowCode]: _, ...remainingRows } = prevRows;
      return remainingRows;
    });
    setTabValue(1); // Go back to the list tab
  };




  const handleCancel = () => {
    setCreateFormData({ taxgroupname: '' });
    setStatus(null);
    setValidationError(null);
    setValidationError(null);
    setValidationErroredit(null);
  };




  const handleEdit = () => {
    const editTabExists = tabs.some(tab => tab.label === 'Edit Tax Groups');
    if (!editTabExists) {
      const newTabLabel = `Edit Tax Groups`;
      setTabs([...tabs, { label: newTabLabel }]);
    }
    const editTabIndex = tabs.findIndex(tab => tab.label === 'Edit Tax Groups');
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
                Tax Group Details
              </Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax Group Name"
                  name="taxgroupname"
                  value={createFormData.taxgroupname}
                  onChange={(event) => setCreateFormData({ ...createFormData, taxgroupname: event.target.value, },setValidationError(null))}
                  variant="outlined"
                  margin="dense"
                  error={!!validationError}
                  helperText={validationError}
                />
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
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>RecStat</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxGroups.map((group) => (
                    <StyledTableRow key={group.code}>
                      <StyledTableCell>{group.name}</StyledTableCell>
                      <StyledTableCell>{group.recstat}</StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" justifyContent="center">
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-customEdit"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(group)}
                          >
                            Edit
                          </CustomButton>
                          <CustomButton
                            variant="outlined"
                            className="MuiButton-outlinedError"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(
                              TAXGRPMASTER_URL_ENDPOINT,
                              group.code,
                              group.name,
                              setTaxGroups,
                              taxGroups,
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
                Edit Tax Group
              </Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax Group Name"
                  name="taxgroupname"
                  value={editingRows[tabs[tabValue].code]?.taxgroupname || ''}
                  onChange={(event) => handleChange(event, tabs[tabValue].code)}
                  variant="outlined"
                  margin="dense"
                  error={!!validationErroredit}
                  helperText={validationErroredit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingRows[tabs[tabValue].code]?.deactivate || false}
                      onChange={(event) => handleChange(event, tabs[tabValue].code)}
                      name="deactivate"
                      color="primary"
                    />
                  }
                  label="Deactivate?"
                />
              </Grid>
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
                    onClick={() => handleCancelUpdateClick(tabs[tabValue].code)}
                    startIcon={<CancelIcon />}
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




export default TaxGroupForm;













