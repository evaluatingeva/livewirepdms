import { Grid, Paper, Typography, ButtonBase, Drawer, Box } from "@mui/material";
import { ArrowDropDownSharp } from "@mui/icons-material"; // Import the dropdown icon
import { useEffect, useState } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetaTitle } from "../../components";
import { useMediaQuery, useTheme } from "@mui/material";
import { masterRoutes } from "../../utils/helpers";
import UnitMasterForm from "./UnitMasterForm";
import DivisionMasterForm from "./DivisionMasterForm";
import ConsigneeMasterForm from "../Masters/ConsigneeMasterForm";
import TaxGroupForm from "./TaxGroupForm";
import AccountForm from "./AccountForm";
import CityMasterForm from "./CityMasterForm";
import StatemasterForm from "./StatemasterForm";
import CompanyMasterForm from "./CompanyMasterForm";

const getColor = (index) => {
  const colors = ["#003366", "#3C3C3C"];
  return colors[index % colors.length];
};

const getsubmenuColor = (index) => {
  const colors = ["#003366","#3C3C3C","#003366","#3C3C3C","#003366"];
  return colors[index % colors.length];
};

const MD = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [submenuData, setSubmenuData] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerWidth = isSmallScreen ? '100%' : '70vw';

  const handleButtonClick = (route, level = 0) => {
    if (route.type === 'form') {
      setCurrentForm(route.name);
      setOpenDrawer(true);
      setSubmenuData(prev => prev.slice(0, level));
    } else if (route.type === 'submenu') {
      setOpenDrawer(false);
      setSubmenuData(prev => {
        const newSubmenuData = [...prev.slice(0, level), { name: route.name, children: route.children, level: level }];
        return newSubmenuData;
      });
    }
  }

  const renderSubmenu = () => {
    return submenuData.map((submenuItem, index) => (
      <Box key={index} sx={{ mt: 2, p: 0, borderTop: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 2, marginLeft: 3 }}>
          Submenu of {submenuItem.name}
        </Typography>
        <Paper
          elevation={1}
          sx={{
            width : '100%',
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 2,
            border: "1px solid #ccccccbc",
            borderRadius: 5,
            mb: 3,
          }}
        >
          <Grid container spacing={2}>
            {submenuItem.children.map((subRoute, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
                <ButtonBase
                  onClick={() => handleButtonClick(subRoute, submenuItem.level + 1)}
                  sx={{ width: '100%' }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      backgroundColor: getsubmenuColor(idx),
                      color: getsubmenuColor(idx) === '#FDD835' ? "black" : "white",
                      border: "1px solid black",
                      padding: "10px",
                      textAlign: "center",
                      width: '100%',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        wordWrap: 'break-word',
                        lineHeight: '1.2',
                        textAlign: 'center',
                      }}
                    >
                      {subRoute.name}
                    </Typography>
                  </Paper>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    ));
  }

  const renderForm = (formName) => {
    switch (formName) {
      case 'Unit master':
        return <UnitMasterForm />;
      case 'Division Master':
        return <DivisionMasterForm />;
      case 'Account':
        return <AccountForm />;
      case 'Consignee Master':
        return <ConsigneeMasterForm />;
      case 'Tax Group':
        return <TaxGroupForm/>;
      case 'City Master':
        return<CityMasterForm/>;
      case 'State Master':
        return <StatemasterForm />;
      case 'Change Unit':
        return <CompanyMasterForm />;
      default:
        return <div>Select a form</div>;
    }
  }

  return (
    <>
      <MetaTitle title="Masterdashboard" />
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: 2,
          border: ".5px solid #ccccccbc",
          borderRadius: 5,
          mb: 3,
        }}
      >
        <Grid container spacing={2}>
          {masterRoutes.map((route, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <ButtonBase
                onClick={() => handleButtonClick(route)}
                sx={{ width: '100%' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: getColor(index),
                    color: "white",
                    padding: "10px",
                    textAlign: "center",
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
<Typography
  variant="h6"
  sx={{
    fontWeight: "bold",
    fontSize: "17px",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    wordWrap: 'break-word',
    lineHeight: '1.2',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  {route.name}
  {route.type === 'submenu' && (
    <ArrowDropDownSharp sx={{ ml: 1, fontSize: '1.5rem' }} />// Use the UnfoldMore icon
  )}
</Typography>
                </Paper>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {renderSubmenu()}

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            width: drawerWidth,
            maxWidth: '100%',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentForm} Form
          </Typography>
          {renderForm(currentForm)}
        </Box>
      </Drawer>
    </>
  );
};

export default MD;
