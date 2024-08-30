import React, { useState, useEffect } from 'react';
import { TextField, FormHelperText, Grid, Typography, Paper, Box, Tabs, Tab, Table, TableBody, TableContainer, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { SCHEDULEMASTER_URL_ENDPOINT } from "../../utils/url_endpoints";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import handleDelete from '../deleteHandler'; 
import { CustomButton, StyledTableCell, StyledTableRow } from '../styledComponents';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ScheduleMasterForm = () => {
    const [formData, setFormData] = useState({
        hcod: "5",
        name: "",
        drcr: "s",
        scH6: "",
        extrA1: "string",
        extrA2: "string",
        extrA3: "string",
        extrA4: "string",
        extrA5: "string",
        scH_NOS: "",
        scH_SEQ: null,
      });

      const [status, setStatus] = useState(null);
      const [editstatus, setEditStatus] = useState(null);
      const [validationError, setValidationError] = useState(null);
      const [tabValue, setTabValue] = useState(0);
      const [tabs, setTabs] = useState([{ label: 'Schedule Master Details' }]);
      const [schedules, setSchedules] = useState([]);
      const [editingRows, setEditingRows] = useState({});

    useEffect(() => {
        fetchScheduleMasters();
        if (tabValue === 1) {
          fetchScheduleMasters();
        }
    }, [tabValue]);

    const fetchScheduleMasters = async () => {
        try {
          const response = await axios.get(`${SCHEDULEMASTER_URL_ENDPOINT}`);
          setSchedules(response.data);
        } catch (error) {
          console.error("Error fetching Schedule masters", error);
        }
      };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
        ...formData, 
        [name]: value 
        });
        setStatus(null);
        setEditStatus(null);
        setValidationError(null);
    };

    const handleEditFormChange = (event, rowCode) => {
        const { name, value } = event.target;
        setEditingRows({
          ...editingRows,
          [rowCode]: {
            ...editingRows[rowCode],
            [name]: value,
          },
        });
        setEditStatus(null);    
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newSchedule = {
            hcod: formData.hcod,
            name: formData.name.trim(),
            drcr: formData.drcr,
            scH6: formData.scH6.trim(),
            extrA1: formData.extrA1,
            extrA2: formData.extrA2,
            extrA3: formData.extrA3,
            extrA4: formData.extrA4,
            extrA5: formData.extrA5,
            scH_NOS: formData.scH_NOS.trim(),
            scH_SEQ: formData.scH_SEQ,
          };
        try {
          const response = await axios.post(`${SCHEDULEMASTER_URL_ENDPOINT}`, newSchedule, {
            headers: {
              'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
              'Content-Type': 'application/json'
            }
          });
          if (response.status === 201) {
            setStatus({ type: 'success', message: 'Schedule added successfully!' });
            setFormData({ name: '', scH6: '', scH_NOS: '', scH_SEQ: null});
            await sleep(1000);
            setStatus(null);
            setEditStatus(null);
            setValidationError(null); 
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            if (error.response.data === "A schedule with the same name already exists.") {
              setValidationError('A schedule with the same name already exists.');
            } else {
              setValidationError('Failed to add Schedule.');
            }
          } else {
            setStatus({ type: 'error', message: 'Failed to add Schedule.' });
          }
        }
    };

    const handleEditClick = (schedule) => {
        const newEditingRows = { ...editingRows, [schedule.hcod]: schedule };
        setEditingRows(newEditingRows);
      
        const editTabExists = tabs.some(tab => tab.label === `Edit ${schedule.name}`);
        if (!editTabExists) {
          setTabs([...tabs, { label: `Edit ${schedule.name}`, hcod: schedule.hcod }]);
        }
        const editTabIndex = tabs.findIndex(tab => tab.label === `Edit ${schedule.name}`);
        setTabValue(editTabIndex >= 0 ? editTabIndex : tabs.length);
    };

    const handleUpdateClick = async (rowCode) => {
        const editedSchedule = {
            HCOD: rowCode,
            NAME: editingRows[rowCode].name.trim(),
            DRCR: "s",
            SCH6: editingRows[rowCode].scH6.trim(),
            EXTRA1: "EXTRA1",
            EXTRA2: "EXTRA2",
            EXTRA3: "EXTRA3",
            EXTRA4: "EXTRA4",
            EXTRA5: "EXTRA5",
            SCH_NOS: editingRows[rowCode].scH_NOS.trim(),
            SCH_SEQ: editingRows[rowCode].scH_SEQ,
        };
    
        try {
          const response = await axios.put(`${SCHEDULEMASTER_URL_ENDPOINT}/${editedSchedule.HCOD}`, editedSchedule, {
            headers: {
              'Authorization': 'Basic ' + btoa('11190802:60-dayfreetrial'),
              'Content-Type': 'application/json'
            }
          });
          if (response.status === 204) {
            await fetchScheduleMasters();
            handleTabClose(rowCode);
            setValidationError(null);
          }
        } catch (error) {
            if (error.response && error.response.status === 400) {
              if (error.response.data === "A schedule with the same name already exists.") {
                setEditStatus({ type: 'error', message: 'A schedule with the same name already exists.' });              } else {
                setValidationError('Failed to add Schedule.');
              }
            } else {
                setValidationError('Failed to add Schedule.');
            }
        }
    };

    const handleCancelUpdateClick = (rowCode) => {
        handleTabClose(rowCode);
        setEditStatus(null);
    };

    const handleTabClose = (rowCode) => {
        const tabIndex = tabs.findIndex(tab => tab.hcod === rowCode);
        setTabs(tabs.filter(tab => tab.hcod !== rowCode));
        setEditingRows(prevRows => {
          const { [rowCode]: _, ...remainingRows } = prevRows;
          return remainingRows;
        });
        setTabValue(1);
    };

    const handleCancel = () => {
        setFormData({ name: '', scH6: '', scH_NOS: '', scH_SEQ: null });
        setStatus(null);
        setEditStatus(null);
        setValidationError(null);
    };

    const handleEdit = () => {
        const listTabExists = tabs.some(tab => tab.label === 'Schedule Master List');
        if (!listTabExists) {
          setTabs([...tabs, { label: 'Schedule Master List' }]);
        }
        const listTabIndex = tabs.findIndex(tab => tab.label === 'Schedule Master List');
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
                  <Typography variant="subtitle1" gutterBottom>Schedule Master Details</Typography>
                  <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Schedule Name"
                        name="name"
                        value={formData.name !== null ? formData.name : ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Schedule Group</InputLabel>
                        <Select
                        label="Schedule Group"
                        name="scH6"
                        value={formData.scH6 !== null ? formData.scH6 : ''}
                        onChange={handleChange}
                        >
                        <MenuItem value="1">Shareholder Fund</MenuItem>
                        <MenuItem value="2">Load Fund</MenuItem>
                        <MenuItem value="3">Deferred Tax Liabilities</MenuItem>
                        <MenuItem value="4">Fixed Assets</MenuItem>
                        <MenuItem value="5">Investments</MenuItem>
                        <MenuItem value="6">Current Assets, Loans and Advances</MenuItem>
                        <MenuItem value="7">Current Liabilities and Provision</MenuItem>
                        <MenuItem value="8">Miscellaneous Expenditure</MenuItem>
                        <MenuItem value="9">Income</MenuItem>
                        <MenuItem value="0">Expenditure</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Schedule No"
                        name="scH_NOS"
                        value={formData.scH_NOS !== null ? formData.scH_NOS : ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Sequence"
                        name="scH_SEQ"
                        value={formData.scH_SEQ !== null ? formData.scH_SEQ : ''}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>
                  {validationError && (
                    <Typography variant="body2" color="red" style={{ marginTop: 10 }}>
                      {validationError}
                    </Typography>
                  )}
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
                <Typography variant="subtitle1" gutterBottom>Schedule Master List</Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 4000, overflowY: 'auto', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                  <Table stickyHeader sx={{ minWidth: 650, width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Schedule Name</StyledTableCell>
                        <StyledTableCell>Schedule Group</StyledTableCell>
                        <StyledTableCell>Schedule No</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.map((schedule) => (
                        <StyledTableRow key={schedule.hcod}>
                          <StyledTableCell>{schedule.name}</StyledTableCell>
                          <StyledTableCell>{schedule.scH6}</StyledTableCell>
                          <StyledTableCell>{schedule.scH_NOS}</StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" justifyContent="center">
                              <CustomButton
                                variant="outlined"
                                className="MuiButton-customEdit"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditClick(schedule)}
                              >
                                Edit
                              </CustomButton>
                              <CustomButton
                                variant="outlined"
                                className="MuiButton-outlinedError"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(
                                  SCHEDULEMASTER_URL_ENDPOINT,
                                  schedule.hcod,
                                  schedule.name,
                                  setSchedules,
                                  schedules,
                                  'hcod',
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
                  <Typography variant="subtitle1" gutterBottom>Edit Record</Typography>
                  <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Schedule Name"
                        name="name"
                        value={editingRows[tabs[tabValue].hcod]?.name !== null ? editingRows[tabs[tabValue].hcod]?.name : ''}
                        onChange={(event) => handleEditFormChange(event, tabs[tabValue].hcod)}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Schedule Group</InputLabel>
                        <Select
                            label="Schedule Group"
                            name="scH6"
                            value={editingRows[tabs[tabValue].hcod]?.scH6 !== undefined ? editingRows[tabs[tabValue].hcod]?.scH6 : ''}
                            onChange={(event) => handleEditFormChange(event, tabs[tabValue].hcod)}
                        >
                            <MenuItem value="1">Shareholder Fund</MenuItem>
                            <MenuItem value="2">Load Fund</MenuItem>
                            <MenuItem value="3">Deferred Tax Liabilities</MenuItem>
                            <MenuItem value="4">Fixed Assets</MenuItem>
                            <MenuItem value="5">Investments</MenuItem>
                            <MenuItem value="6">Current Assets, Loans and Advances</MenuItem>
                            <MenuItem value="7">Current Liabilities and Provision</MenuItem>
                            <MenuItem value="8">Miscellaneous Expenditure</MenuItem>
                            <MenuItem value="9">Income</MenuItem>
                            <MenuItem value="0">Expenditure</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Schedule No"
                        name="scH_NOS"
                        value={editingRows[tabs[tabValue].hcod]?.scH_NOS !== null ? editingRows[tabs[tabValue].hcod]?.scH_NOS : ''}
                        onChange={(event) => handleEditFormChange(event, tabs[tabValue].hcod)}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Sequence"
                        name="scH_SEQ"
                        value={editingRows[tabs[tabValue].hcod]?.scH_SEQ !== null ? editingRows[tabs[tabValue].hcod]?.scH_SEQ : ''}
                        onChange={(event) => handleEditFormChange(event, tabs[tabValue].hcod)}
                        variant="outlined"
                        margin="dense"
                    />
                    </Grid>

                  {editstatus && (
                    <Typography variant="body2" color={editstatus.type === 'success' ? 'green' : 'red'} style={{ marginTop: 10 }}>
                      {editstatus.message}
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
                        onClick={() => handleUpdateClick(tabs[tabValue].hcod)}
                      >
                        Update Changes
                      </CustomButton>
                    </Grid>
                    <Grid item>
                      <CustomButton
                        variant="outlined"
                        className="MuiButton-outlinedSecondary"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelUpdateClick(tabs[tabValue].hcod)}
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

export default ScheduleMasterForm;
