import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite-no-reset.min.css";

import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import {
  ThemeProvider as AdminThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";

import { Layout } from "./components";
import {
  TD,
  MD,
  Dashboard,
  CustomButtons,
} from "./pages";
import {
  primaryColor1,
  primaryColor2,
  primaryColor3,
  primaryColor4,
  primaryColor5,
} from "../constants";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  useEffect(() => {
    const currentTime = new Date().getTime();
  }, []);

  const [mode, setMode] = useState(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      return theme;
    }
    localStorage.setItem("theme", "light");
    return "light";
  });

  // Primary colors
  document.documentElement.style.setProperty(
    "--clr-primary-1",
    `${primaryColor1}`
  );
  document.documentElement.style.setProperty(
    "--clr-primary-2",
    `${primaryColor2}`
  );
  document.documentElement.style.setProperty(
    "--clr-primary-3",
    `${primaryColor3}`
  );
  document.documentElement.style.setProperty(
    "--clr-primary-4",
    `${primaryColor4}`
  );
  document.documentElement.style.setProperty(
    "--clr-primary-5",
    `${primaryColor5}`
  );

  const darkThemeAdmin = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontWeightBold: 600,
      fontWeightMedium: 500,
      fontWeightRegular: 400,
      fontWeightLight: 300,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 400,
            textTransform: "none",
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          },
        },
        defaultProps: {
          autoComplete: "off",
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ".MuiChip-label": {
              fontFamily: "Poppins, sans-serif",
            },
          },
          defaultProps: {
            size: "small",
          },
        },
      },
      MuiDatePicker: {
        defaultProps: {
          format: "DD/MM/YYYY",
        },
      },
      MuiDataGrid: {
        defaultProps: {
          columnHeaderHeight: 48,
        },
        styleOverrides: {
          root: {
            fontSize: 13,
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-visible": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-visible": {
              outline: "none",
            },
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            // zIndex: 1400,
          },
        },
      },
      MuiTable: {
        defaultProps: {},
      },
    },
    palette: {
      mode: mode,
      ...(mode === "light"
        ? {
            common: {
              black: "#000",
              white: "#fff",
            },
            primary: {
              main: `${primaryColor4}`,
              light: `${primaryColor3}`,
              dark: `${primaryColor5}`,
              contrastText: "#fff",
              yyy: "#fff",
            },
            secondary: {
              main: "#9c27b0",
              light: "#ba68c8",
              dark: "#7b1fa2",
              contrastText: "#fff",
            },
            error: {
              main: "#d32f2f",
              light: "#ef5350",
              dark: "#c62828",
              contrastText: "#fff",
            },
            warning: {
              main: "#ed6c02",
              light: "#ff9800",
              dark: "#e65100",
              contrastText: "#fff",
            },
            info: {
              main: "#0288d1",
              light: "#03a9f4",
              dark: "#01279b",
              contrastText: "#fff",
            },
            success: {
              main: "#2e7d32",
              light: "#4caf50",
              dark: "#1b5e20",
              contrastText: "#fff",
            },
            grey: {
              50: "#fafafa",
              100: "#f5f5f5",
              200: "#eeeeee",
              300: "#e0e0e0",
              400: "#bdbdbd",
              500: "#9e9e9e",
              600: "#757575",
              700: "#616161",
              800: "#424242",
              900: "#212121",
              A100: "#f5f5f5",
              A200: "#eeeeee",
              A400: "#bdbdbd",
              A700: "#616161",
            },
            text: {
              contrastText: "#000",
              primary: "rgba(0,0,0,0.87)",
              secondary: "rgba(0,0,0,0.6)",
              disabled: "#00000088",
            },
            divider: "rgba(0,0,0,0.12)",
            background: {
              paper: "#fff",
              default: "#fff",
              control: "#fff",
            },
            buttonColor: {
              bgcolor: "#fff",
            },
          }
        : {
            common: {
              black: "#000",
              white: "#fff",
            },
            primary: {
              main: `${primaryColor4}`,
              light: `${primaryColor3}`,
              dark: `${primaryColor5}`,
              contrastText: "rgba(0,0,0,0.87)",
            },
            secondary: {
              main: "#ce93d8",
              light: "#f3e5f5",
              dark: "#ab47bc",
              contrastText: "rgba(0,0,0,0.87)",
            },
            error: {
              main: "#f44336",
              light: "#e57373",
              dark: "#d32f2f",
              contrastText: "#fff",
            },
            warning: {
              main: "#ffa726",
              light: "#ffb74d",
              dark: "#f57c02",
              contrastText: "rgba(0,0,0,0.87)",
            },
            info: {
              main: "#29b6f6",
              light: "#4fc3f7",
              dark: "#0288d1",
              contrastText: "rgba(0,0,0,0.87)",
            },
            success: {
              main: "#66bb6a",
              light: "#81c784",
              dark: "#388e3c",
              contrastText: "rgba(0,0,0,0.87)",
            },
            grey: {
              50: "#fafafa",
              100: "#f5f5f5",
              200: "#eeeeee",
              300: "#e0e0e0",
              400: "#bdbdbd",
              500: "#9e9e9e",
              600: "#757575",
              700: "#616161",
              800: "#424242",
              900: "#212121",
              A100: "#f5f5f5",
              A200: "#eeeeee",
              A400: "#bdbdbd",
              A700: "#616161",
            },
            text: {
              contrastText: "#fff",
              primary: "rgba(255, 255, 255,0.9)",
              secondary: "rgba(255,255,255,0.7)",
              disabled: "rgba(255,255,255,0.5)",
            },
            divider: "rgba(255,255,255,0.12)",
            background: {
              paper: "#000",
              default: "#000",
              control: "#262626",
            },
            buttonColor: {
              bgcolor: "rgb(9 137 255)",
            },
          }),
    },
  });

  const toggleTheme = () => {
    if (mode === "dark") {
      localStorage.setItem("theme", "light");
      setMode("light");
    }
    if (mode === "light") {
      localStorage.setItem("theme", "dark");
      setMode("dark");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AdminThemeProvider theme={darkThemeAdmin}>
        <Router>
          <Routes>
            {/* Root path directly navigates to dashboard */}
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="/" element={<Outlet />}>
              <Route
                path=""
                element={
                  <AdminThemeProvider theme={darkThemeAdmin}>
                    <Layout mode={mode} toggleTheme={toggleTheme}>
                      <Outlet />
                    </Layout>
                  </AdminThemeProvider>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="md" element={<MD />} />
                <Route path="td" element={<TD />} />
                <Route path="custombuttons" element={<CustomButtons />} />
              </Route>

            </Route>
          
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
        <ToastWrapper>
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            closeButton={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="dark"
          />
        </ToastWrapper>
      </AdminThemeProvider>
    </DndProvider>
  );
}

const ToastWrapper = styled.div`
  .Toastify__toast {
    width: max-content;
    max-width: 90vw;
    margin: 15px auto;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 11px;
    min-height: auto;
  }

  @media (min-width: 486px) {
    .Toastify__toast-container--bottom-center {
      width: max-content;
      margin-bottom: 0px;
    }
    .Toastify__toast {
      width: max-content;
      max-width: 90vw;
      margin: 10px auto;
      font-size: 14px;
      padding: 10px 15px;
    }
  }
`;

export default App;
