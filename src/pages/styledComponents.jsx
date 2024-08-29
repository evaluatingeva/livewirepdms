import { Button, TableCell, TableRow } from '@mui/material';
import { styled } from "@mui/system";

// CustomButton
export const CustomButton = styled(Button)(({ theme }) => ({
  margin: 8,
  padding: "6px 16px",
  borderRadius: "8px",
  border: `2px solid`,
  backgroundColor: "transparent",
  fontWeight: 600,
  letterSpacing: "0.5px",
  minWidth: "80px",
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
}));

// StyledTableCell
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  borderBottom: `2px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  textAlign: 'center',
}));

// StyledTableRow
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  transition: 'background-color 0.3s ease',
}));
