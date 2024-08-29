import React, { useEffect, useState } from 'react';
import {
  Brightness4,
  Brightness7,
  DashboardOutlined,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
  FormatListBulleted,
  Group,
  History,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Logout,
  Receipt,
  ViewList,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logoHeader from "../assets/logo-header1.png";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import {
  adminRoutesWithNames,
  receptionRoutes,
} from "../utils/helpers";
import Loading from "./Loading";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const MuiDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  display: { xs: "none", md: "block" },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MuiAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.complex,
    }),
  }),
}));

const Layout = ({ mode, toggleTheme }) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();
  const [openConfirmationDialog, setConfirmationDialog] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openLogoutLoading, setOpenLogoutLoading] = useState(false);

  const handleClickOpenDialog = () => {
    setConfirmationDialog(true);
  };

  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const [openMaster, setOpenMaster] = useState(
    localStorage.getItem("om") === "true" ? true : false
  );
  const [openReception, setOpenReception] = useState(
    localStorage.getItem("or") === "true" ? true : false
  );
  const [openLabTesting, setOpenLabTesting] = useState(
    localStorage.getItem("olb") === "true" ? true : false
  );
  const [openUtilities, setOpenUtilities] = useState(
    localStorage.getItem("ou") === "true" ? true : false
  );
  const [openReports, setOpenReports] = useState(
    localStorage.getItem("ors") === "true" ? true : false
  );
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleMasterClick = () => {
    setOpenMaster(!openMaster);
    localStorage.setItem("om", !openMaster);
    setOpenReception(false);
    setOpenLabTesting(false);
    setOpenUtilities(false);
    setOpenReports(false);
    localStorage.setItem("or", false);
    localStorage.setItem("olb", false);
    localStorage.setItem("ou", false);
    localStorage.setItem("ors", false);
  };

  const getChildSubmenuKeys = (item) => {
    const keys = [];
    if (item.children) {
      item.children.forEach((child) => {
        if (!child.path) {
          keys.push(child.name);
          keys.push(...getChildSubmenuKeys(child));
        }
      });
    }
    return keys;
  };

  const handleClick = () => {
    if (isSubMenu) {
      setOpenSubmenus((prev) => ({
        ...prev,
        [itemKey]: !prev[itemKey],
        ...getChildSubmenuKeys(item).reduce((acc, key) => {
          acc[key] = false; // Close all nested submenus when this submenu is toggled
          return acc;
        }, {}),
      }));
    } else {
      handleLastVisited(item?.path);
      navigate(item?.path);
    }
  };

  const handleReceptionClick = () => {
    setOpenReception(!openReception);
    localStorage.setItem("or", !openReception);
    setOpenMaster(false);
    setOpenLabTesting(false);
    setOpenUtilities(false);
    setOpenReports(false);
    localStorage.setItem("om", false);
    localStorage.setItem("olb", false);
    localStorage.setItem("ou", false);
    localStorage.setItem("ors", false);
  };

  const handleLabTestingClick = () => {
    setOpenLabTesting(!openLabTesting);
    localStorage.setItem("olb", !openLabTesting);
    setOpenMaster(false);
    setOpenReception(false);
    setOpenUtilities(false);
    setOpenReports(false);
    localStorage.setItem("om", false);
    localStorage.setItem("or", false);
    localStorage.setItem("ou", false);
    localStorage.setItem("ors", false);
  };

  const handleUtilitiesClick = () => {
    setOpenUtilities(!openUtilities);
    localStorage.setItem("ou", !openUtilities);
    setOpenMaster(false);
    setOpenReception(false);
    setOpenLabTesting(false);
    setOpenReports(false);
    localStorage.setItem("om", false);
    localStorage.setItem("or", false);
    localStorage.setItem("olb", false);
    localStorage.setItem("ors", false);
  };

  const handleReportsClick = () => {
    setOpenReports(!openReports);
    localStorage.setItem("ors", !openReports);
    setOpenMaster(false);
    setOpenReception(false);
    setOpenLabTesting(false);
    setOpenUtilities(false);
    localStorage.setItem("om", false);
    localStorage.setItem("or", false);
    localStorage.setItem("olb", false);
    localStorage.setItem("ou", false);
  };

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(
    localStorage.getItem("if")
      ? localStorage.getItem("if") === "true"
        ? true
        : false
      : true
  );
  const [isFixed, setIsFixed] = useState(
    localStorage.getItem("if")
      ? localStorage.getItem("if") === "true"
        ? true
        : false
      : true
  );
  const [permanentDrawerOpen, setPermanentDrawerOpen] = useState(false);

  const handleSmallDrawerOpen = () => {
    setOpen(!open);
    setPermanentDrawerOpen(!permanentDrawerOpen);
    setIsFixed(!isFixed);
  };

  const handleDrawerOpen = () => {
    if (open && permanentDrawerOpen) return;
    setOpen(true);
    setPermanentDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    if ((!open && !permanentDrawerOpen) || isFixed) return;
    setOpen(false);
    setPermanentDrawerOpen(false);
  };

  const handleIsFixed = () => {
    setIsFixed(!isFixed);
    setOpen(!open);
    setPermanentDrawerOpen(!permanentDrawerOpen);
    localStorage.setItem("if", !isFixed);
  };

  const handleLastVisited = (path) => {
    if (path?.startsWith("/")) {
      path = path?.split("/")?.[1];
    }
    localStorage.setItem("lv", path);
  };

  const navigate = useNavigate();

  const checkTokenExpiration = () => {
    // Remove this function if not needed anymore
  };

  useEffect(() => {
    // Remove this useEffect if not needed anymore
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiAppBar
          position="fixed"
          open={open}
          sx={{
            zIndex: isSmallDevice ? (theme) => theme.zIndex.drawer + 1 : 1,
            color: "text.contrastText",
            backgroundColor: "background.paper",
            boxShadow: "none",
            borderBottom: "1px solid #cccccc24",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              backgroundColor: "background.paper",
              marginLeft: {
                md: isFixed ? "240px" : 7,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                overflowX: {
                  xs: "scroll",
                  md: "hidden",
                },
              }}
            >
              <Box display="flex">
                <IconButton
                  aria-label="open drawer"
                  onClick={handleSmallDrawerOpen}
                  sx={{
                    mr: 1,
                    display: {
                      md: "none",
                    },
                    color: "text.primary",
                  }}
                >
                  <FormatListBulleted />
                </IconButton>
                <Box
                  sx={{
                    mr: "auto",
                    display: "flex",
                    alignItems: "center",
                    my: "auto",
                    marginleft: isFixed ? 240 : 66,
                    transition: "all .3s ease-in-out",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    fontWeight={900}
                    ml={1}
                    fontSize={18}
                    sx={{
                      display: { md: "none" },
                    }}
                  >
                    LT
                  </Typography>
                  <Typography
                    variant="h6"
                    noWrap
                    fontWeight={500}
                    ml={1}
                    fontSize={18}
                    sx={{
                      display: { md: "none" },
                    }}
                  >
                    -
                  </Typography>
                  <Typography
                    variant="h6"
                    noWrap
                    fontWeight={500}
                    ml={1}
                    fontSize={18}
                    sx={{
                      width: {
                        xs: "200px",
                        sm: "100%",
                      },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {
                      adminRoutesWithNames?.find(
                        (item) => item?.path === currentPath
                      )?.name
                    }
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={2}
                flexShrink={0}
              >
                <Tooltip title={`Last Login`}>
                  <IconButton sx={{}} color="inherit" disableTouchRipple>
                    <History />
                  </IconButton>
                </Tooltip>
                <IconButton sx={{}} onClick={toggleTheme} color="inherit">
                  {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </MuiAppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          onClick={() => {}}
          PaperProps={{
            sx: { backgroundColor: "background.paper" },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <Box
            sx={{
              mt: {
                xs: 6.75,
                md: 6.2,
              },
              overflow: "auto",
              height: "100%",
              ...(mode === "light" && {
                bgcolor: "white",
              }),
            }}
          >
            <List
              sx={{
                py: 0,
                maxHeight: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                " &::-webkit-scrollbar": {
                  width: 6,
                  backgroundColor: "#ccc",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#969696",
                  borderRadius: 4,
                },
              }}
            >
              <ListItem
                disablePadding
                key="Dashboard"
                onClick={() => {
                  handleDrawerClose();
                  handleSmallDrawerOpen();
                  handleLastVisited("dashboard");
                  return navigate("dashboard");
                }}
              >
                <ListItemButton
                  sx={{
                    py: 0.3,
                    backgroundColor:
                      currentPath === "dashboard"
                        ? mode === "light"
                          ? "#ebebeb"
                          : "#505050a7"
                        : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                      color: "text.contrastText",
                    }}
                  >
                    <DashboardOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Dashboard"
                    sx={{ color: "text.contrastText" }}
                  />
                </ListItemButton>
              </ListItem>

              <>
              </>

              <>
                <ListItemButton
                  sx={{
                    py: 0.3,
                  }}
                  onClick={handleReceptionClick}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: 2, color: "text.contrastText" }}
                  >
                    <ViewList fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Reception"
                  />
                  <ExpandMore
                    sx={{
                      transform: openReception
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "all .3s ease-in-out",
                    }}
                  />
                </ListItemButton>
                <Collapse in={openReception} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {receptionRoutes?.map((item) => {
                      return (
                        <ListItemButton
                          key={`${item?.path}1`}
                          sx={{
                            pl: 2.5,
                            py: 0.3,
                            backgroundColor:
                              currentPath === item?.path
                                ? mode === "light"
                                  ? "#ebebeb"
                                  : "#505050a7"
                                : "transparent",
                          }}
                          onClick={() => {
                            handleDrawerClose();
                            handleSmallDrawerOpen();
                            handleLastVisited(item?.path);
                            return navigate(item?.path);
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 2,
                              color: "text.contrastText",
                            }}
                          >
                            {item?.icon}
                          </ListItemIcon>
                          <ListItemText
                            primaryTypographyProps={{ fontSize: 14 }}
                            primary={item?.name}
                            sx={{
                              opacity: open ? 1 : 0,
                              color: "text.contrastText",
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </>

              <>
              </>

              <>
              </>

              <>
                <ListItemButton
                  sx={{
                    py: 0.3,
                  }}
                  onClick={handleUtilitiesClick}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: 2, color: "text.contrastText" }}
                  >
                    <ViewList fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Utilities"
                  />
                  <ExpandMore
                    sx={{
                      transform: openUtilities
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "all .3s ease-in-out",
                    }}
                  />
                </ListItemButton>{" "}
                <Collapse in={openUtilities} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        pl: 2.5,
                        py: 0.3,
                        backgroundColor:
                          currentPath === "tax-master"
                            ? mode === "light"
                              ? "#ebebeb"
                              : "#505050a7"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleDrawerClose();
                        handleSmallDrawerOpen();
                        handleLastVisited("tax-master");
                        return navigate("tax-master");
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          color: "text.contrastText",
                        }}
                      >
                        <FiberManualRecord fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: 14 }}
                        primary="Tax Master"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "text.contrastText",
                        }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        pl: 2.5,
                        py: 0.3,
                        backgroundColor:
                          currentPath === "company-info"
                            ? mode === "light"
                              ? "#ebebeb"
                              : "#505050a7"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleDrawerClose();
                        handleSmallDrawerOpen();
                        handleLastVisited("company-info");
                        return navigate("company-info");
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          color: "text.contrastText",
                        }}
                      >
                        <FiberManualRecord fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: 14 }}
                        primary="Company Info"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "text.contrastText",
                        }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </>

              <ListItem
                disablePadding
                key="Proforma Invoice"
                onClick={() => {
                  handleDrawerClose();
                  handleSmallDrawerOpen();
                  handleLastVisited("proforma-invoice");
                  return navigate("proforma-invoice");
                }}
              >
                <ListItemButton
                  sx={{
                    py: 0.3,
                    backgroundColor:
                      currentPath === "proforma-invoice"
                        ? mode === "light"
                          ? "#ebebeb"
                          : "#505050a7"
                        : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                      color: "text.contrastText",
                    }}
                  >
                    <Receipt fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Proforma Invoice"
                    sx={{ color: "text.contrastText" }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem
                disablePadding
                key="Users"
                onClick={() => {
                  handleDrawerClose();
                  handleSmallDrawerOpen();
                  handleLastVisited("users");
                  return navigate("users");
                }}
              >
                <ListItemButton
                  sx={{
                    py: 0.3,
                    backgroundColor:
                      currentPath === "users"
                        ? mode === "light"
                          ? "#ebebeb"
                          : "#505050a7"
                        : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                      color: "text.contrastText",
                    }}
                  >
                    <Group fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Users"
                    sx={{ color: "text.contrastText" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
          <MuiDrawer
            variant="permanent"
            open={open}
            sx={{
              display: { xs: "none", md: "block" },
            }}
            PaperProps={{
              sx: { backgroundColor: "background.paper", zIndex: 1200 },
            }}
          >
            <Box
              sx={{
                ml: { xs: 0, sm: 0 },
                mr: "auto",
                display: "flex",
                alignItems: "center",
                my: "auto",
                pr: 1.55,
                pl: 1.75,
                py: 0.55,
                height: 51.5,
              }}
            >
              {open ? (
                <img
                  src={logoHeader}
                  alt="lt"
                  style={{
                    marginLeft: 25,
                  }}
                  width={170}
                  height={39}
                />
              ) : (
                <img
                  src={logo}
                  alt="lt"
                  style={{
                    marginLeft: 0,
                  }}
                  width={30}
                />
              )}
            </Box>
            <List
              sx={{
                height: "100%",
                mt: 0.1,
                ...(mode === "light" && {
                  bgcolor: "white",
                }),
                maxHeight: "100%",
                overflexY: "auto",
                overflowX: "hidden",
                " &::-webkit-scrollbar": {
                  width: 7,
                  backgroundColor: "#ccc",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--clr-primary-4)",
                  borderRadius: 3,
                },
                py: 0,
              }}
            >
              <ListItem
                onClick={() => {
                  handleLastVisited("dashboard");
                  return navigate("dashboard");
                }}
                key="Dashboard"
                disablePadding
                sx={{
                  display: "block",
                  backgroundColor:
                    currentPath === "dashboard"
                      ? mode === "light"
                        ? mode === "light"
                          ? "#ebebeb"
                          : "#505050a7"
                        : "#505050a7"
                      : "transparent",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 4,
                    justifyContent: open ? "initial" : "center",
                    py: 0.3,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1.5 : "auto",
                      justifyContent: "center",
                      color: "text.contrastText",
                    }}
                  >
                    <DashboardOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: 14 }}
                    primary="Dashboard"
                    sx={{
                      opacity: open ? 1 : 0,
                      color: "text.contrastText",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <>
              {  receptionRoutes.map((route, index) => (
          <ListItem
            onClick={() => {
              handleLastVisited(route.path);
              navigate(route.path);
            }}
            key={index}
            disablePadding
            sx={{
              display: "block",
              backgroundColor:
                currentPath === route.path
                  ? mode === "light"
                    ? "#ebebeb" // Light mode active item background
                    : "#505050a7" // Dark mode active item background
                  : "transparent", // Non-active items
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 4,
                justifyContent: open ? "initial" : "center",
                py: 0.3,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1.5 : "auto",
                  justifyContent: "center",
                  color: "text.contrastText",
                }}
              >
                {route.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: 14 }}
                primary={route.name}
                sx={{
                  opacity: open ? 1 : 0,
                  color: "text.contrastText",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))
}
              </>
              
            </List>
          </MuiDrawer>
        </Box>
        <Button
          onClick={() => handleIsFixed()}
          sx={{
            display: { xs: "none", md: "block" },
            transition: "all .2s ease-in-out",
            position: "absolute",
            left: open ? 240 : 56,
            top: 58,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: "0px solid #fff",
            zIndex: 1000,
            color: "var(--clr-primary-4)",
            borderRight: ".5px solid var(--clr-primary-4)",
            borderTop: ".5px solid var(--clr-primary-4)",
            borderBottom: ".5px solid var(--clr-primary-4)",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "background.paper",
            },
            py: 0,
            px: 0.1,
            minWidth: 0,
            height: 23,
          }}
        >
          {isFixed ? (
            <KeyboardDoubleArrowLeft fontSize="small" />
          ) : (
            <KeyboardDoubleArrowRight fontSize="small" />
          )}
        </Button>
      </Box>
      <Toolbar variant="dense" />
      <Box
        onClick={() => {
          handleDrawerClose();
        }}
        onMouseEnter={handleDrawerClose}
        sx={{
          marginLeft: {
            md: isFixed ? "240px" : 7,
          },
          right: 0,
          flexGrow: { md: 1 },
          overflow: "auto",
          bgcolor: mode === "light" ? "rgb(241 245 249)" : "#1f1f1ff8",
          mt: 0.1,
          height: { xs: "calc(100vh - 50px)", sm: "calc(100vh - 50px)" },
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
      <div>
        <Dialog open={openConfirmationDialog} onClose={handleCloseDialog}>
          <DialogTitle>Logout Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0 1.5rem 1rem 0",
            }}
          >
            <Button
              disabled={openLogoutLoading}
              variant="outlined"
              size="small"
              onClick={handleCloseDialog}
              color="success"
              sx={{
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={openLogoutLoading}
              color="error"
              variant="contained"
              size="small"
              autoFocus
              sx={{
                textTransform: "none",
              }}
              onClick={() => {
                setOpenLogoutLoading(true);
                setTimeout(() => {
                  setOpenLogoutLoading(false);
                  handleCloseDialog();
                }, 1000);
              }}
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </div>
      <Loading open={openLoading} />
    </>
  );
};

export default Layout;
