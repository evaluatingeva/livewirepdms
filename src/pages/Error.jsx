import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MetaTitle } from "../components";
const Error = () => {
  return (
    <>
      <MetaTitle title="404" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 40,
              md: 60,
            },
            fontWeight: "bold",
          }}
        >
          404
        </Typography>
        <Typography
          sx={{
            fontSize: {
              xs: 16,
              md: 22,
            },
            fontWeight: "semi-bold",
            mb: 3,
          }}
        >
          Sorry, the page you tried cannot be found
        </Typography>
        <Button
          variant="contained"
          color="info"
          size="small"
          component={Link}
          to="/dashboard"
          sx={{ fontSize: 15 }}
        >
          <ArrowBack sx={{ mr: 1 }} fontSize="small" />
          Back to Home
        </Button>
      </Box>
    </>
  );
};

const Wrapper = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default Error;
