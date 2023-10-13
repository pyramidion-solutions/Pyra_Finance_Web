import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Dashboard from "../Dashboard/Dashboard";
import IncomeDashboard from "../../Income/IncomeDashboard";
import ExpenseDashboard from "../../Expense/ExpenseDashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const [showNavBar, setShowNavBar] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("tokenauth");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderSelectedComponent = () => {
    if (selectedTab === "dashboard") {
      return <Dashboard />;
    } else if (selectedTab === "income") {
      return <IncomeDashboard />;
    } else if (selectedTab === "expenses") {
      return <ExpenseDashboard />;
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("selectedTab");
    if (storedTab) {
      setSelectedTab(storedTab);
    }
  }, []);
  return (
    <div style={{ display: "flex" }}>
      {showNavBar && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#000000",
            },
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#FFFFFF",
                marginLeft: "16px",
              }}
            >
              Pyra Fin
            </Typography>
          </Toolbar>
          <List>
            <Divider />
            <ListItem
              button
              key="dashboard"
              onClick={() => handleTabClick("dashboard")}
              sx={{
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon style={{ color: "#FBC91B" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" style={{ color: "#FBC91B" }} />
            </ListItem>
            <ListItem
              button
              key="income"
              onClick={() => handleTabClick("income")}
              sx={{
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <ListItemIcon>
                <MonetizationOnIcon style={{ color: "#FBC91B" }} />
              </ListItemIcon>
              <ListItemText primary="Income" style={{ color: "#FBC91B" }} />
            </ListItem>
            <ListItem
              button
              key="expenses"
              onClick={() => handleTabClick("expenses")}
              sx={{
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <ListItemIcon>
                <AccountBalanceWalletIcon style={{ color: "#FBC91B" }} />
              </ListItemIcon>
              <ListItemText primary="Expenses" style={{ color: "#FBC91B" }} />
            </ListItem>
            <ListItem
              button
              key="logout"
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon style={{ color: "#FBC91B" }} />
              </ListItemIcon>
              <ListItemText primary="Logout" style={{ color: "#FBC91B" }} />
            </ListItem>
          </List>
        </Drawer>
      )}
      <div style={{ flex: 1 }}>{renderSelectedComponent()}</div>
    </div>
  );
};
export default Layout;
