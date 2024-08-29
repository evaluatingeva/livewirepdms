import { Add, Clear, Reorder, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MetaTitle, TaxMasterReorder } from "../../components";
import {
  deleteMaster,
  loadTaxMasterList,
  resetDeleteStatus,
  resetSaveStatus,
  saveMaster,
} from "../../features/memberSlice";
import { LoadingButton } from "@mui/lab";

function customNoRowsOverlay() {
  return (
    <GridOverlay>
      <div>No Results Found...</div>
    </GridOverlay>
  );
}

const TaxMaster = () => {
  const {
    isLoadTaxMasterListLoading,
    isLoadTaxMasterListError,
    isLoadTaxMasterListSuccess,
    taxMasterList,
    taxMasterListOutRecordCount,
    isSaveMasterLoading,
    isSaveMasterError,
    isSaveMasterSuccess,
    isDeleteMasterLoading,
    isDeleteMasterError,
    isDeleteMasterSuccess,
  } = useSelector((state) => state.member);
  const { userId, authToken } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    getValues,
  } = useForm({
    mode: "onTouched",
  });

  const [taxOperationDd, setTaxOperationDd] = useState([
    { id: 1, operation: "Plus (+)", value: "plus" },
    { id: 2, operation: "Minus (-)", value: "minus" },
    { id: 3, operation: "Round (0)", value: "round" },
  ]);
  const [taxOperation, setTaxOperation] = useState("Plus (+)");

  const [statusDd, setStatusDd] = useState([
    { id: 1, status: "Published" },
    { id: 0, status: "Unpublished" },
  ]);
  const [status, setStatus] = useState("Published");
  const [dbId, setDbId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [nameShrink, setNameShrink] = useState(false);
  const [remarkShrink, setRemarkShrink] = useState(false);
  const [percentageShrink, setPercentageShrink] = useState(false);
  const [rows, setRows] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [openConfirmationDialog, setConfirmationDialog] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [openTaxMasterReorder, setOpenTaxMasterReorder] = useState(false);
  const [reorderedTaxes, setReorderedTaxes] = useState([]);

  const handleClickOpenDialog = () => {
    setConfirmationDialog(true);
  };

  const handleCloseDialog = () => {
    setConfirmationDialog(false);
    setToBeDeletedId(null);
  };
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("md"));

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const columns = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   flex: 0.25,
    //   minWidth: 60,
    //   sortable: false,
    // },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: "percentage",
      headerName: "Percentage (%)",
      flex: 0.18,
      minWidth: 100,
      sortable: false,
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 0.2,
      minWidth: 130,
      sortable: false,
    },
    // {
    //   field: "update",
    //   headerName: "Actions",
    //   flex: 0.25,
    //   minWidth: 130,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Box
    //       sx={{
    //         display: "flex",
    //         // flexDirection: "column",
    //         justifyContent: "flex-start",
    //         alignItems: "center",
    //         gap: 1,
    //         width: "100%",
    //       }}
    //     >
    //       <Button
    //         size="small"
    //         variant="outlined"
    //         color="info"
    //         sx={{
    //           height: 27,
    //           fontSize: 12,
    //         }}
    //         onClick={() => {
    //           handleEditClick(params.row.dbId);
    //         }}
    //       >
    //         Edit
    //       </Button>
    //       <Button
    //         size="small"
    //         variant="outlined"
    //         color="error"
    //         sx={{
    //           height: 27,
    //           fontSize: 12,
    //         }}
    //         onClick={() => {
    //           setToBeDeletedId(params.row.dbId);
    //           handleClickOpenDialog();
    //         }}
    //       >
    //         Delete
    //       </Button>
    //     </Box>
    //   ),
    // },
  ];

  const onSubmit = (formData) => {
    if (isEdit) {
      dispatch(
        saveMaster({
          details: {
            ...formData,
            taxOperation: taxOperationDd?.find(
              (item) => item.operation === formData.taxOperation
            )?.value,
            status: statusDd?.find((item) => item.status === formData.status)
              ?.id,
            gstBehaviour: parseInt(formData.gstBehaviour),
            updatedDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            updatedBy: userId,
          },
          authToken,
          endpoint: "SaveTaxMaster",
        })
      );
    } else {
      dispatch(
        saveMaster({
          details: {
            id: 0,
            ...formData,
            taxOperation: taxOperationDd?.find(
              (item) => item.operation === formData.taxOperation
            )?.value,
            status: statusDd?.find((item) => item.status === formData.status)
              ?.id,
            displayOrder: taxMasterList.length + 1,
            createdDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            createdBy: userId,
            updatedDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
            updatedBy: userId,
          },
          authToken,
          endpoint: "SaveTaxMaster",
        })
      );
    }
  };

  const setValues = (selectedRow) => {
    setValue("id", selectedRow.id);
    setValue("name", selectedRow.name, {
      shouldValidate: true,
    });
    selectedRow.name ? setNameShrink(true) : setNameShrink(false);
    setValue("remark", selectedRow.remark);
    selectedRow.remark ? setRemarkShrink(true) : setRemarkShrink(false);
    setValue("percentage", selectedRow.percentage, {
      shouldValidate: true,
    });
    selectedRow.percentage >= 0
      ? setPercentageShrink(true)
      : setPercentageShrink(false);
    setValue("status", selectedRow.status);
    setValue(
      "taxOperation",
      taxOperationDd?.find((item) => item.value === selectedRow.taxOperation)
        ?.operation
    );
    setValue("gstBehaviour", selectedRow.gstBehaviour ? 1 : 0);
    setValue(
      "isDisablemanualpriceentry",
      selectedRow.isDisablemanualpriceentry ? 1 : 0
    );
    setValue(
      "status",
      selectedRow.status === "1" ? "Published" : "Unpublished"
    );
    setValue("displayOrder", selectedRow.displayOrder);
    setValue("createdDate", selectedRow.createdDate);
    setValue("createdBy", selectedRow.createdBy);
  };

  const handleEditClick = (dbId) => {
    setIsEdit(true);
    setToggleDrawer(true);
    const selectedRow = taxMasterList.find((item) => item.id === dbId);
    setValues(selectedRow);
  };

  useEffect(() => {
    dispatch(
      loadTaxMasterList({
        authToken,
        filters: {
          page: paginationModel.page + 1,
          pageResults: 50,
          ...(searchTerm && { searchTerm }),
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setRows(
      taxMasterList.map((item, index) => {
        return {
          ...item,
          index,
          id: paginationModel.page * paginationModel.pageSize + index + 1,
          dbId: item?.id,
          createdAt: moment(item.createdDate).format("DD-MM-YYYY"),
        };
      })
    );
    setReorderedTaxes(taxMasterList);
  }, [taxMasterList]);

  useEffect(() => {
    if (isSaveMasterSuccess || isDeleteMasterSuccess) {
      dispatch(
        loadTaxMasterList({
          authToken,
          filters: {
            page: paginationModel.page + 1,
            pageResults: 50,
            ...(searchTerm && { searchTerm }),
          },
        })
      );
      setIsEdit(false);
      setToggleDrawer(false);
      setOpenTaxMasterReorder(false);
      reset();
      setNameShrink(false);
      setRemarkShrink(false);
      setPercentageShrink(false);
      dispatch(resetSaveStatus());
      dispatch(resetDeleteStatus());
    }
  }, [isSaveMasterSuccess, isDeleteMasterSuccess]);

  return (
    <>
      <MetaTitle title="Tax Master" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          py: 1.5,
          px: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        }}
      >
        <TextField
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyDown={(e) => {
            if (!searchTerm || isLoadTaxMasterListLoading) return;
            if (e.key === "Enter") {
              setPaginationModel({
                page: 0,
                pageSize: 50,
              });
              dispatch(
                loadTaxMasterList({
                  authToken,
                  filters: {
                    page: 1,
                    pageResults: 50,
                    ...(searchTerm && { searchTerm }),
                  },
                })
              );
            }
          }}
          SelectProps={{
            autoWidth: true,
          }}
          placeholder="Search"
          InputProps={{
            autoComplete: "off",
            endAdornment: (
              <>
                {searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => {
                        if (isLoadTaxMasterListLoading) return;
                        setSearchTerm("");
                        setPaginationModel({
                          page: 0,
                          pageSize: 50,
                        });
                        dispatch(
                          loadTaxMasterList({
                            authToken,
                            filters: {
                              page: 1,
                              pageResults: 50,
                            },
                          })
                        );
                      }}
                      aria-label="clear input"
                    >
                      <Clear
                        fontSize="small"
                        sx={{
                          color: "var(--clr-primary-4)",
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                )}
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    sx={{
                      borderTopRightRadius: 14,
                      borderBottomRightRadius: 14,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      py: 0.5,
                      px: 0.75,
                      "&:disabled": {
                        cursor: "not-allowed",
                      },
                    }}
                    onClick={() => {
                      if (isLoadTaxMasterListLoading) return;
                      setPaginationModel({
                        page: 0,
                        pageSize: 50,
                      });
                      dispatch(
                        loadTaxMasterList({
                          authToken,
                          filters: {
                            page: 1,
                            pageResults: 50,
                            ...(searchTerm && {
                              searchTerm,
                            }),
                          },
                        })
                      );
                    }}
                  >
                    <Search
                      sx={{
                        fontSize: 25,
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              </>
            ),
            sx: {
              backgroundColor: "background.paper",
              "& .MuiInputBase-input": {
                pl: 1,
              },
              px: 0,
              py: 0,
              "& .MuiInputBase-input::placeholder": {
                fontSize: 14,
              },
              ".MuiInputBase-input .MuiOutlinedInput-input": {
                padding: 0,
              },
              "& .MuiInputAdornment-root": {
                mx: 0,
              },
              height: 33,
            },
          }}
          sx={{
            mx: 2.5,
            width: 250,
            "& .MuiInputBase-input.Mui-disabled": {
              cursor: "not-allowed",
            },
          }}
        />
        {taxMasterList.length > 0 && (
          <Button
            size="small"
            variant="contained"
            color="info"
            sx={{
              textTransform: "none",
              // mr: 2.5,
            }}
            endIcon={<Reorder />}
            onClick={() => setOpenTaxMasterReorder(true)}
          >
            Reorder
          </Button>
        )}
        {/* <Button
          size="small"
          variant="contained"
          color="success"
          sx={{
            textTransform: "none",
          }}
          startIcon={<Add />}
          onClick={() => setToggleDrawer(true)}
        >
          {isSmallDevice ? "Add" : "Add New"}
        </Button> */}
      </Box>
      <Grid
        container
        spacing={0}
        sx={{
          px: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        }}
        mt={0}
      >
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              px: 1,
              width: "100%",
              height: "calc(100vh - 115px)",
            }}
          >
            <DataGrid
              loading={isLoadTaxMasterListLoading}
              rows={rows}
              columns={columns}
              sx={{
                border: "none",
                ".MuiTablePagination-selectLabel": {
                  mt: 1.5,
                },
                ".MuiTablePagination-displayedRows": {
                  mt: 0,
                },
                ".MuiDataGrid-footerContainer": {
                  minHeight: "40px",
                  maxHeight: "40px",
                  pr: 2,
                },
                ".MuiToolbar-root": {
                  minHeight: "40px",
                  maxHeight: "40px",
                },
                ".MuiButtonBase-root": {
                  padding: "4px",
                },
                ".MuiDataGrid-cell--textLeft": {
                  pt: 1.5,
                  pb: 1,
                  alignItems: "flex-start",
                },
                ".MuiDataGrid-cell--textCenter": {
                  py: 1,
                  alignItems: "flex-start",
                },
              }}
              // rowHeight={95}
              getRowHeight={() => "auto"}
              slots={{
                noRowsOverlay: customNoRowsOverlay,
              }}
              disableColumnFilter={true}
              disableColumnMenu={true}
              rowCount={taxMasterListOutRecordCount}
              paginationMode="server"
              pageSizeOptions={[50]}
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) => {
                const { pageSize, page } = newModel;
                setPaginationModel({
                  page,
                  pageSize,
                });
                dispatch(
                  loadTaxMasterList({
                    authToken,
                    filters: {
                      page: page + 1,
                      pageResults: pageSize,
                      ...(searchTerm && { searchTerm }),
                    },
                  })
                );
              }}
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
      <SwipeableDrawer
        disableEscapeKeyDown
        anchor={"right"}
        open={toggleDrawer}
        onClose={(e, reason) => {
          if (reason === "backdropClick") return;
          setToggleDrawer(false);
          reset();
          setIsEdit(false);
          setDbId(0);
          setNameShrink(false);
          setRemarkShrink(false);
          setPercentageShrink(false);
        }}
        onOpen={() => setToggleDrawer(true)}
        sx={{
          display: toggleDrawer ? "block" : "none",
          zIndex: 1300,
        }}
      >
        <Box
          role="presentation"
          sx={{
            width: {
              xs: 300,
              sm: 350,
              md: 900,
              lg: 1100,
              xl: 1300,
            },
            display: "flex",
            flexDirection: "column",
            px: 2,
            pt: {
              xs: 2,
              md: 4,
            },
            pb: 2,
          }}
          component={"form"}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "left", mb: { xs: 2, md: 4 } }}
          >
            {isEdit ? "Edit Tax" : "Add New Tax"}
          </Typography>{" "}
          <Grid container spacing={isSmallDevice ? 0 : 2} rowGap={0}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                variant="outlined"
                size="small"
                label="Name"
                margin="dense"
                fullWidth
                name="name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                  maxLength: {
                    value: 256,
                    message: "Name should not exceed 256 characters",
                  },
                  onChange: (e) => {
                    if (e.target.value && !nameShrink) {
                      setNameShrink(true);
                    }
                  },
                  onBlur: (e) => {
                    if (!e.target.value) {
                      setNameShrink(false);
                    }
                  },
                })}
                InputLabelProps={{
                  shrink: nameShrink,
                }}
                onFocus={() => {
                  setNameShrink(true);
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />{" "}
              <TextField
                // required
                variant="outlined"
                size="small"
                label="Remark"
                margin="dense"
                multiline
                minRows={7}
                maxRows={14}
                fullWidth
                name="remark"
                type="text"
                {...register("remark", {
                  onChange: (e) => {
                    if (e.target.value && !remarkShrink) {
                      setRemarkShrink(true);
                    }
                  },
                  onBlur: (e) => {
                    if (!e.target.value) {
                      setRemarkShrink(false);
                    }
                  },
                })}
                InputLabelProps={{
                  shrink: remarkShrink,
                }}
                onFocus={() => {
                  setRemarkShrink(true);
                }}
                error={!!errors.remark}
                helperText={errors.remark?.message}
              />{" "}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                variant="outlined"
                size="small"
                label="Percentage"
                margin="dense"
                fullWidth
                name="percentage"
                type="number"
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "E") e.preventDefault();
                }}
                {...register("percentage", {
                  required: "Percentage is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Percentage should not be less than 0",
                  },
                  max: {
                    value: 100,
                    message: "Percentage should not be more than 100",
                  },
                  // onChange: (e) => {
                  // let value = e.target.value;
                  // value = parseFloat(value)
                  // ? parseFloat(value)?.toString()
                  // : "";
                  // e.target.value = parseFloat(value);
                  // },
                  onChange: (e) => {
                    if (e.target.value && !percentageShrink) {
                      setPercentageShrink(true);
                    }
                  },
                  onBlur: (e) => {
                    if (!e.target.value) {
                      setPercentageShrink(false);
                    }
                  },
                })}
                InputLabelProps={{
                  shrink: percentageShrink,
                }}
                onFocus={() => {
                  setPercentageShrink(true);
                }}
                error={!!errors.percentage}
                helperText={errors.percentage?.message}
              />{" "}
              <Controller
                name="taxOperation"
                control={control}
                defaultValue={taxOperation}
                rules={{
                  required: "Tax Operation is required",
                  maxLength: {
                    value: 256,
                    message: "Tax Operation should not exceed 256 characters",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    error={!!errors.taxOperation}
                  >
                    <InputLabel id="taxOperation">Tax Operation</InputLabel>
                    <Select
                      {...field}
                      id="taxOperation"
                      variant="outlined"
                      label="Tax Operation"
                      fullWidth
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 220,
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          // WebkitTextFillColor: "#00000088",
                        },
                      }}
                    >
                      {taxOperationDd.map((item) => (
                        <MenuItem key={item.id} value={item.operation}>
                          {item.operation}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.taxOperation?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="status"
                control={control}
                defaultValue={status}
                rules={{
                  required: "Status is required",
                  maxLength: {
                    value: 256,
                    message: "Status should not exceed 256 characters",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    error={!!errors.status}
                  >
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                      {...field}
                      id="status"
                      variant="outlined"
                      label="Status"
                      fullWidth
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 220,
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          // WebkitTextFillColor: "#00000088",
                        },
                      }}
                    >
                      {statusDd.map((item) => (
                        <MenuItem key={item.id} value={item.status}>
                          {item.status}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.state?.message}</FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="gstBehaviour"
                control={control}
                defaultValue={0}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value === 1}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? 1 : 0)
                          }
                          size="small"
                        />
                      }
                      label="Include this value before tax calculation?"
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="isDisablemanualpriceentry"
                control={control}
                defaultValue={0}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value === 1}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? 1 : 0)
                          }
                          size="small"
                        />
                      }
                      label="Disable manual price entry?"
                    />
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mt: 2.5,
              position: "sticky",
              pt: 2,
              pb: 2.5,
              bottom: 0,
              zIndex: 1000,
              backgroundColor: "background.control",
            }}
          >
            <LoadingButton
              loading={isSaveMasterLoading}
              // size="small"
              type="submit"
              variant="contained"
              color="success"
              // disabled={!code || !name}
              sx={{
                width: 80,
              }}
            >
              Submit
            </LoadingButton>
            <Button
              // size="small"
              variant="outlined"
              color="error"
              sx={{
                width: 80,
              }}
              onClick={() => {
                if (!isEdit) {
                  reset();
                  setIsEdit(false);
                  setDbId(0);
                  setNameShrink(false);
                  setRemarkShrink(false);
                  setPercentageShrink(false);
                }
                if (isEdit) {
                  handleEditClick(getValues("id"));
                }
              }}
            >
              Reset
            </Button>
            <Button
              // size="small"
              variant="outlined"
              color="warning"
              sx={{
                width: 80,
              }}
              onClick={() => {
                setToggleDrawer(false);
                reset();
                setIsEdit(false);
                setDbId(0);
                setNameShrink(false);
                setRemarkShrink(false);
                setPercentageShrink(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
      {openTaxMasterReorder && (
        <TaxMasterReorder
          props={{
            taxes: reorderedTaxes,
            setTaxes: setReorderedTaxes,
            open: openTaxMasterReorder,
            setOpen: setOpenTaxMasterReorder,
          }}
        />
      )}
      <div>
        <Dialog open={openConfirmationDialog} onClose={handleCloseDialog}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Delete this record?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0 1.5rem 1rem 0",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              color="success"
              size="small"
              sx={{
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch(
                  deleteMaster({
                    id: toBeDeletedId,
                    authToken,
                    endpoint: "DeleteTaxMaster",
                  })
                );
                handleCloseDialog();
              }}
              color="error"
              variant="outlined"
              size="small"
              autoFocus
              sx={{
                textTransform: "none",
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
export default TaxMaster;
