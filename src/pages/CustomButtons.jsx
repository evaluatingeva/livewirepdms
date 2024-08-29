// CustomButtonGroup.jsx
import { Button, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const CustomButton = styled(Button)(({ theme }) => ({
  margin: 8,
  padding: "12px 24px",
  borderRadius: "8px",
  border: `2px solid`,
  backgroundColor: "transparent",
  fontWeight: 600,
  letterSpacing: "0.5px",
  width: "120px",  // Ensures all buttons have the same width
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.15)",
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(1),
  },
  "&.MuiButton-outlinedPrimary": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  "&.MuiButton-outlinedSecondary": {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
  "&.MuiButton-outlinedError": {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
  "&.MuiButton-customEdit": {
    borderColor: "#FFA726",
    color: "#FFA726",
    "&:hover": {
      backgroundColor: "#FFA726",
      color: "#fff",
    },
  },
  "&.MuiButton-customExit": {
    borderColor: "#BDBDBD",
    color: "#BDBDBD",
    "&:hover": {
      backgroundColor: "#BDBDBD",
      color: "#fff",
    },
  },
}));

const CustomButtons = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
      <Grid container spacing={2} justifyContent="left">
        <Grid item>
          <CustomButton 
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
            startIcon={<CancelIcon />}
          >
            Cancel
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton 
            variant="outlined" 
            className="MuiButton-customEdit" 
            startIcon={<EditIcon />}
          >
            Edit
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton 
            variant="outlined" 
            className="MuiButton-outlinedError" 
            startIcon={<DeleteIcon />}
          >
            Delete
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton 
            variant="outlined" 
            className="MuiButton-customExit" 
            startIcon={<ExitToAppIcon />}
          >
            Exit
          </CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomButtons;
