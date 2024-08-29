
import {
  CardMembershipOutlined,
  Diversity2Rounded,
  FiberManualRecord,
  Spoke,
  ViewList,
  ViewListRounded,
} from "@mui/icons-material";
import CryptoJS from "crypto-js";

export const formatPrice = (number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const calculateFinancialYears = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const years = [];

  const startYear = 2020;

  for (let year = startYear; year <= currentYear; year++) {
    const financialYear = `${year}-${year + 1}`;
    years.push(financialYear);
  }

  return years;
};



export const adminRoutesWithNames = [
  {
    path: "dashboard",
    name: "Dashboard",
  },
  {
    path: "md",
    name: "MD",
  },
  {
    path: "td",
    name: "TD",
  },
  {
    path: "users",
    name: "Users",
  },
];
export const TransactionRoutes = [
  {
    name: "Order Management",
    type: 'submenu',
    children : [
      {
        path: "child-1",
        name: "Sales Order Booking",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Sales Order Approval",
        type: 'form',
      },
      {
        path: "child-3",
        name: "Cancellation Sales Order (Partially)",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Sales Order Clearance",
        type: 'form',
      },
      {
        path: "child-5",
        name: "Sales Order Close",
        type: 'form',
      },
      {
        path: "child-6",
        name: "Purchase Order Booking",
        type: 'form',
      },
      {
        path: "child-7",
        name: "Purchase Order Approval",
        type: 'form',
      },
      {
        path: "child-8",
        name: "Goods Receipt Note Against P.O.",
        type: 'form',
      },
      {
        path: "child-9",
        name: "Clear Purchase Order",
        type: 'form',
      },
    ]
  },
  {
    name: "Goods Receipt Note (GRN)",
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "GRN of Material",
        type: 'form',
      },
      {
        path: "child-2",
        name: "GRN of Inhouse Jobwork (Yarn / Fabric)",
        type: 'form',
      },
      {
        path: "child-3",
        name: "GRN of Inhouse Jobwork (Beam)",
        type: 'form',
      },
      {
        path: "child-4",
        name: "GRN of Beam",
        type: 'form',
      },
      {
        path: "child-5",
        name: "GRN W/O Account Effect",
        type: 'form',
      },
      {
        path: "child-6",
        name: "GRN Approval",
        type: 'form',
      },
      {
        path: "child-7",
        name: "GRN of Processed Job",
        type: 'form',
      },
    ]
  },
  {
    name: "Material Return to Party",
    type: 'submenu',
    children: [{
      path: "child-1",
      name: "Yarn Return",
      type: 'form',
    },
    {
      path: "child-2",
      name: "Beam Return",
      type: 'form',
    },]
  },
  {
    name: "Store Management",
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "Issue",
        type: 'submenu',
        children :[
          {
            path: "child-1",
            name: "Issue from Store",
            type: 'form',
          },
          {
            path: "child-2",
            name: "Issue of Yarn [Merge Wise]",
            type: 'form',
          },
        ]
      },
      {
        path: "child-2",
        name: "Return",
        type: 'submenu',
        children :[
          {
            path: "child-1",
            name: "Return To Store",
            type: 'form',
          },
        ]
      },
      {
        path: "child-3",
        name: "Outward for Job/RGP/NRGP",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Manual Clearance of Job/RGP",
        type: 'form',
      },
    
    ]
  },
  {
    name: "Production Entry",
    type: 'submenu',
    children :[
      {
        path: "child-1",
        name: "Beam",
        type: 'submenu',
        children :[
          {
            path: "child-1",
            name: "Beam Production Entry",
            type: 'form',
          },
          {
            path: "child-2",
            name: "Update Beam Production",
            type: 'form',
          },
          {
            path: "child-3",
            name: "Job Received Entry",
            type: 'form',
          },
        ]
      },
      {
        path: "child-2",
        name: "Weaving",
        type: 'submenu',
        children :[
          {
            path: "child-1",
            name: "Weaving Production Entry",
            type: 'form',
          },
          {
            path: "child-2",
            name: "Update Weaving Production",
            type: 'form',
          },
          {
            path: "child-3",
            name: "Job Received Entry",
            type: 'form',
          },
          {
            path: "child-4",
            name: "Grey Direct GRN Entry",
            type: 'form',
          },
          {
            path: "child-5",
            name: "Grey Inhouse GRN Entry",
            type: 'form',
          },
          {
            path: "child-6",
            name: "Manual Job Beam Clear",
            type: 'form',
          },
        ]
      },
      {
        path: "child-3",
        name: "Daily Production",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Daily Production Import",
        type: 'form',
      },
    ]
  },
  {
    name: "Singeing / Finishing Entry",
    type: 'form',
  },
  {
    name: "Inspection",
    type: 'submenu',
    children :[
      {
        path: "child-1",
        name: "Inspection Entry",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Update Inspection Entry",
        type: 'form',
      },
      {
        path: "child-3",
        name: "Assign Shade Group to Roll",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Assign Pillar No. to Roll",
        type: 'form',
      },
      {
        path: "child-5",
        name: "Assign Location",
        type: 'form',
      },
      {
        path: "child-6",
        name: "Good's Cut Entry",
        type: 'form',
      },
      {
        path: "child-7",
        name: "Assign Screen to Roll",
        type: 'form',
      },
      {
        path: "child-8",
        name: "Update Sort",
        type: 'form',
      },
      {
        path: "child-9",
        name: "Assign Roll to Party",
        type: 'form',
      },
      {
        path: "child-10",
        name: "Doff Roll Clearance",
        type: 'form',
      },
      {
        path: "child-11",
        name: "Roll Grade Change",
        type: 'form',
      },
      {
        path: "child-12",
        name: "Assign Shade Group Through Excel",
        type: 'form',
      },
    ]
  },
  {
    name: "Dispatch",
    type: 'submenu',
    children :[
      
        {
          path: "child-1",
          name: "Market/Export (With Order)",
          type: 'form',
        },
        {
          path: "child-2",
          name: "Market/Export (Without Order)",
          type: 'form',
        },
        {
          path: "child-3",
          name: "Captive Beam Challan",
          type: 'form',
        },
        {
          path: "child-4",
          name: "Captive Grey Challan",
          type: 'form',
        },
        {
          path: "child-5",
          name: "Beam Dispatch",
          type: 'form',
        },
        {
          path: "child-6",
          name: "Assign Grey Mending Meters",
          type: 'form',
        },
      
    ]
  },
  {
    name: "Wastage Packing",
    type: 'form',
  },
  {
    name: "Wastage Dispatch",
    type: 'form',
  },
  {
    name: "Beam Loading",
    type: 'form',
  },
  {
    name: "Manual Beam UnLoading (Clear)",
    type: 'form',
  },
  {
    name: "Sampling",
    type: 'submenu',
    children :[
      {
        path: "child-1",
        name: "Roll Wise Sample Entry",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Roll Wise Sample Issue",
        type: 'form',
      },
    ]
  },
  {
    name: "Sale Bill with Order",
    type: 'form',
  },
  {
    name: "Sale Bill (Without Order)",
    type: 'form',
  },
  {
    name: "Direct Sale",
    type: 'form',
  },
  {
    name: "Returnable Bobbins / Pallet",
    type: 'form',
  },
  {
    name: "Returnable Empty Pipes",
    type: 'form',
  },
  {
    name: "QA Test Result",
    type: 'form',
  },
  {
    name: "Sample Roll QA Test Report",
    type: 'form',
  },
  {
    name: "Sale Bill Approval",
    type: 'form',
  },
  {
    name: "Gate Pass Entry",
    type: 'submenu',
    children :[
      {
        path: "child-1",
        name: "Finish Gate Pass",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Gate Pass Direct Sale",
        type: 'form',
      },
    ]
  },
  {
    name: "Vehicle Entry",
    type: 'form',
  },
  {
    name: "Multi Process Entry",
    type: 'form',
  },
  {
    name: "Assign EWay Bill No.",
    type: 'form',
  },
];

export const masterRoutes = [
  {
    path: "member-group",
    name: "Unit master",
    icon: <CardMembershipOutlined fontSize="small" />,
    type: 'form',
  },
  {
    path: "member",
    name: "Division Master",
    icon: <Diversity2Rounded fontSize="small" />,
    type: 'form',
  },
  {
    path: "sln-parts-group",
    name: "Group Master",
    icon: <Spoke fontSize="small" />,
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "Schedule Master",
        type: 'form',
      },
      {
        path: "child-2",
        name: "A/C. Group",
        type: 'form',
      }
    ]
  },
  {
    path: "sln-parts",
    name: "Account Master",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "Account",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Consignee Master",
        type: 'form',
      }
    ]
  },
  {
    path: "sample-test-head-master",
    name: "Finish Item / Product",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "Finish Item Master",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Sort Master / Style Master",
        type: 'form',
      },
      {
        path: "child-3",
        name: "Screen Master",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Set Master for Warping / Dyeing",
        type: 'form',
      },
      {
        path: "child-5",
        name: "Set Master for Weaving",
        type: 'form',
      },
      {
        path: "child-6",
        name: "Recipe (Color) for Comaprision",
        type: 'form',
      },
      {
        path: "child-7",
        name: "Formula (Chemical) for Comaprision",
        type: 'form',
      },
      {
        path: "child-8",
        name: "Process Master",
        type: 'form',
      },
      {
        path: "child-9",
        name: "Style wise Process Sequence",
        type: 'form',
      },
      {
        path: "child-10",
        name: "Weave Master",
        type: 'form',
      },
      {
        path: "child-11",
        name: "Peg plan",
        type: 'form',
      },
      {
        path: "child-12",
        name: "Job Sort",
        type: 'form',
      },
      {
        path: "child-13",
        name: "Job Set",
        type: 'form',
      },
      {
        path: "child-14",
        name: "Product Category",
        type: 'form',
      },
      {
        path: "child-15",
        name: "Set Group Master",
        type: 'form',
      },
      {
        path: "child-16",
        name: "Process Route",
        type: 'form',
      }
    ]
  },

  {
    path: "sample-type-master",
    name: "Raw Item / Product",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [
      {
        path: "child-1",
        name: "Item Category",
        type: 'form',
      },
      {
        path: "child-2",
        name: "Item Group",
        type: 'form',
      },
      {
        path: "child-3",
        name: "Item Master",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Merge Master",
        type: 'form',
      },
      {
        path: "child-5",
        name: "HSN Master",
        type: 'form',
      },
      {
        path: "child-6",
        name: "Service Master",
        type: 'form',
      },
      {
        path: "child-7",
        name: "Location Master",
        type: 'form',
      },
    ]
  },
  {
    path: "sample-master",
    name: "References",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [
      {
        path: "child-2",
        name: "State Master",
        type: 'form',
      },
      {
        path: "child-3",
        name: "City Master",
        type: 'form',
      },
      {
        path: "child-4",
        name: "Area Master",
        type: 'form',
      },
      {
        path: "child-5",
        name: "Party Group",
        type: 'form',
      },
      {
        path: "child-6",
        name: "Broker",
        type: 'form',
      },
      {
        path: "child-7",
        name: "Costing Head",
        type: 'form',
      },
      {
        path: "child-8",
        name: "Godown Master",
        type: 'form',
      },
      {
        path: "child-9",
        name: "Transport",
        type: 'form',
      },
      {
        path: "child-10",
        name: "Vehicle Master",
        type: 'form',
      },
      {
        path: "child-11",
        name: "Unit Of Measurement",
        type: 'form',
      },
      {
        path: "child-12",
        name: "Bank Master",
        type: 'form',
      },
      {
        path: "child-13",
        name: "Shade Group",
        type: 'form',
      },
      {
        path: "child-14",
        name: "Sales Man Master",
        type: 'form',
      },
      {
        path: "child-15",
        name: "Machine Master",
        type: 'submenu',
        children: [
          {
            path: "child-1",
            name: "Shade Group",
            type: 'form',
          },
          {
            path: "child-2",
            name: "Sales Man Master",
            type: 'form',
          },
        ]
      },
      {
        path: "child-16",
        name: "Packing Station Master",
        type: 'form',
      },
      {
        path: "child-17",
        name: "Packaging Master",
        type: 'form',
      },
      {
        path: "child-18",
        name: "Operator Master",
        type: 'form',
      },
      {
        path: "child-19",
        name: "Shift Master",
        type: 'form',
      },
      {
        path: "child-20",
        name: "Flange Master",
        type: 'form',
      },
      {
        path: "child-21",
        name: "Production Loss Reason Master",
        type: 'form',
      },
      {
        path: "child-22",
        name: "Terms And Condition",
        type: 'form',
      },
      {
        path: "child-23",
        name: "Specification Master",
        type: 'submenu',
        children: [
          {
            path: "child-1",
            name: "Specification",
            type: 'form',
          },
          {
            path: "child-2",
            name: "Defect",
            type: 'form',
          },
        ]
      },
      {
        path: "child-24",
        name: "Shade Master",
        type: 'form',
      },
      {
        path: "child-25",
        name: "Grade Master",
        type: 'form',
      },
      {
        path: "child-26",
        name: "Production Loss Entry",
        type: 'form',
      },
      {
        path: "child-27",
        name: "Pillar Master",
        type: 'form',
      },
      {
        path: "child-28",
        name: "Fix Cost Master",
        type: 'form',
      },
      {
        path: "child-29",
        name: "Over Dyed Master",
        type: 'form',
      },
      {
        path: "child-30",
        name: "Pin To Pin Master",
        type: 'form',
      },
      {
        path: "child-31",
        name: "Company Type",
        type: 'form',
      },
      {
        path: "child-32",
        name: "P.O. Serial Master",
        type: 'form',
      }
    ]
  },
  {
    path: "sample-test",
    name: "Tax Reference",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [ {
      path: "child-2",
      name: "Tax Group",
      type: "form"
    },
    {
      path: "child-3",
      name: "Sale Tax",
      type: "form"
    }]
  },
  {
    path: "test-category",
    name: "Bill Entry Setup",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children : [{
      path: "child-1",
      name: "Sales Transaction",
      type: "form"
    },
    {
      path: "child-2",
      name: "GRN of Material",
      type: "form"
    },
    {
      path: "child-3",
      name: "GRN of Services",
      type: "form"
    },
    {
      path: "child-4",
      name: "Add New Charge in Master",
      type: "form"
    },
    {
      path: "child-5",
      name: "Serial Type Master",
      type: "form"
    }
    
    ]
  },
  {
    path: "receipt-type",
    name: "Opening",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'submenu',
    children: [{
      path: "child-1",
      name: "Store Stock [Itemwise]",
      type: "form"
    },
    {
      path: "child-2",
      name: "Store Stock of Jumbo Beams",
      type: "form"
    },
    {
      path: "child-3",
      name: "Store Stock of Returnable Pipes",
      type: "form"
    },
    {
      path: "child-4",
      name: "WIP Stock [Division+Machine Wise]",
      type: "form"
    },
    {
      path: "child-5",
      name: "Raw Item Merge Opening",
      type: "form"
    }
    ]
  },
  {
    path: "cheque-bank-transfer",
    name: "Change Financial Year",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'form',
  },
  {
    path: "cheque-bank-transfer",
    name: "Change Unit",
    icon: <FiberManualRecord fontSize="small" />,
    type: 'form',
  },

];

export const receptionRoutes = [
  {
    path: "md",
    name: "MASTERS",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "td",
    name: "TRANSACTION",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "sln-parts-issue",
    name: "REPORTS",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "payment-entry",
    name: "DOCUMENT PRINTING",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "receipt-entry",
    name: "SETUP",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "receipt-entry",
    name: "MISC.",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "receipt-entry",
    name: "UTILITY",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "receipt-entry",
    name: "LINKS",
    icon: <FiberManualRecord fontSize="small" />,
  },
  {
    path: "receipt-entry",
    name: "OTHER",
    icon: <FiberManualRecord fontSize="small" />,
  },
];



export const phoneNumberRegex = /^[6-9][0-9]{9}$/;
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;