import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import logo from "../assets/logo.png";

const Loading = ({ open }) => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 1500 }} open={open}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e3e3e3",
          borderRadius: "50%",
          p: 1.75,
          userSelect: "none",
        }}
      >
        <CircularProgress
          color="inherit"
          size={110}
          thickness={1.3}
          sx={{
            position: "absolute",
            color: "#DE0077",
          }}
        />
        <Box
          sx={{
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Typography variant="h5" color="darkblue" sx={{ fontWeight: 900 }}>
            LT
          </Typography> */}
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              margin: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Backdrop>
  );
};
export default Loading;
