import { Grid, Paper, Typography, ButtonBase, Drawer, Box } from "@mui/material";
import { useEffect, useState } from "react";
import React from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import { MetaTitle } from "../../components";
import { TransactionRoutes } from "../../utils/helpers";
import { useNavigate } from 'react-router-dom';
import GRNEntryForm from "./GRNEntryforRawMaterialForm";

const getColor = (index) => {
  const colors = ["#003366","#3C3C3C"];
  return colors[index % colors.length];
};

// Font resizing logic function for submenu items
const getFontSize = (text, maxWidth, maxHeight) => {
  const testElement = document.createElement('span');
  testElement.style.visibility = 'hidden';
  testElement.style.position = 'absolute';
  testElement.style.whiteSpace = 'normal';
  testElement.style.fontSize = '16px';
  document.body.appendChild(testElement);
  let fontSize = 16;
  testElement.innerText = text;

  while ((testElement.offsetWidth > maxWidth || testElement.offsetHeight > maxHeight) && fontSize > 17) {
    fontSize -= 1;
    testElement.style.fontSize = `${fontSize}px`;
  }

  document.body.removeChild(testElement);
  return fontSize;
};

const TD = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [submenuData, setSubmenuData] = useState([]); // New state to manage submenu at each level

  const handleButtonClick = (route, level = 0) => {
    if (route.type === 'form') {
      setCurrentForm(route.name);
      setOpenDrawer(true);

      // Keep only relevant submenus open when a form is opened
      setSubmenuData(prev => prev.slice(0, level));
    } else if (route.type === 'submenu') {
      setOpenDrawer(false);

      // Replace the current level submenu and remove submenus deeper than the current level
      setSubmenuData(prev => {
        const newSubmenuData = [...prev.slice(0, level), { name: route.name, children: route.children, level: level }];
        return newSubmenuData;
      });
    }
  }

  const renderSubmenu = () => {
    return submenuData.map((submenuItem, index) => (
      <Box key={index} sx={{ mt: 2, p: 2, borderTop: '1px solid #ccc' }}>
        <Typography variant="h6">
          Submenu of {submenuItem.name}
        </Typography>
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
                    backgroundColor: getColor(idx),
                    color: getColor(idx) === '#FDD835' ? "black" : "white", // Set text color based on background
                    border: "1px solid black", // Add black border
                    padding: "10px",
                    textAlign: "center",
                    width: '100%',
                    height: '60px', // Fixed height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: `${getFontSize(subRoute.name, 120, 60)}px`, // Apply font size adjustment
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2, // Allow maximum two lines
                      wordWrap: 'break-word', // Allow wrapping
                      lineHeight: '1.2', // Adjust line height to fine-tune centering
                      textAlign: 'center', // Ensure the text is centered
                    }}
                  >
                    {subRoute.name}
                  </Typography>
                </Paper>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>
    ));
  }
  const renderForm = (formName) => {
    switch (formName) {
      case 'GRN of Material' :
        return <GRNEntryForm />;
      case 'Unit master':
        return <div>Unit Master Form</div>;
      case 'Division Master':
        return <div>Division Master Form</div>;
      case 'Group Child 1':
        return <div>Group Child 1 Form</div>;
      case 'Group Child 2':
        return <div>Group Child 2 Form</div>;
      // Add more cases as needed
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
          {TransactionRoutes.map((route, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <ButtonBase
                onClick={() => handleButtonClick(route)}
                sx={{ width: '100%' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: getColor(index),
                    color: getColor(index) === '#FDD835' ? "black" : "white", // Set text color based on background
                    border: "1px solid black", // Add black border
                    padding: "10px",
                    textAlign: "center",
                    width: '100%',
                    height: '60px', // Fixed height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "15px", // Fixed font size for main buttons
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2, // Allow maximum two lines
                      wordWrap: 'break-word', // Allow wrapping
                      lineHeight: '1.2', // Adjust line height to fine-tune centering
                      textAlign: 'center', // Ensure the text is centered
                    }}
                  >
                    {route.name}
                  </Typography>
                </Paper>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Render all active submenus */}
      {renderSubmenu()}

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 1300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentForm} Form
          </Typography>
          {/* Render form components based on `currentForm` */}
          {renderForm(currentForm)}
        </Box>
      </Drawer>
    </>
  );
};

export default TD;
