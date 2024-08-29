import { ArrowForward } from "@mui/icons-material";
import { Button, Grid, Paper, Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTitle } from "../components";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const { data } = await axios.get(
          "/GetDashboardData"
        );

        if (data.status === "FAIL") {
          throw new Error(data.message);
        }

        setDashboardData(data?.jsonResponse || {});
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        setDashboardData({});
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <MetaTitle title="Dashboard" />
      <Grid
        container
        spacing={2}
        sx={{
          py: 3,
          px: 4,
        }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{}}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 2,
              gap: 1,
              py: 2,
              border: ".5px solid #ccccccbc",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={66}
                height={33.9}
                m={0}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
                animation="wave"
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {dashboardData?.membersCount || 0}
              </Typography>
            )}
            <Typography
              sx={{
                color: "inherit",
              }}
            >
              Members
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={{
                mt: 1,
              }}
              endIcon={<ArrowForward />}
              component={Link}
              to="/member"
            >
              More Info
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{}}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 2,
              gap: 1,
              py: 2,
              border: ".5px solid #ccccccbc",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={66}
                height={33.9}
                m={0}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
                animation="wave"
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {dashboardData?.slnPartsCount || 0}
              </Typography>
            )}
            <Typography
              sx={{
                color: "inherit",
              }}
            >
              SLN Parts
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                mt: 1,
              }}
              endIcon={<ArrowForward />}
              component={Link}
              to="/sln-parts"
            >
              More Info
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{}}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 2,
              gap: 1,
              py: 2,
              border: ".5px solid #ccccccbc",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={66}
                height={33.9}
                m={0}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
                animation="wave"
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {dashboardData?.sampleTestCount || 0}
              </Typography>
            )}
            <Typography
              sx={{
                color: "inherit",
              }}
            >
              Sample Test
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{
                mt: 1,
              }}
              endIcon={<ArrowForward />}
              component={Link}
              to="/sample-test"
            >
              More Info
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{}}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: 2,
              gap: 1,
              py: 2,
              border: ".5px solid #ccccccbc",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={66}
                height={33.9}
                m={0}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                }}
                animation="wave"
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {dashboardData?.usersCount || 0}
              </Typography>
            )}
            <Typography
              sx={{
                color: "inherit",
              }}
            >
              Users
            </Typography>
            <Button
              variant="contained"
              color="warning"
              size="small"
              sx={{
                mt: 1,
              }}
              endIcon={<ArrowForward />}
              component={Link}
              to="/users"
            >
              More Info
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default Dashboard;
