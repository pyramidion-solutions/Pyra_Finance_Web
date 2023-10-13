import React from "react";
import { Grid } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import ApiCalls from "../API/ApiCalls";
import ExpenseRecord from "./ExpenseRecord";
import ExpenseImg from "../../src/assets/Images/expense.png";
import { useNavigate } from "react-router-dom";
export default function ExpenseDashboard() {
  const navigate = useNavigate();

  const [totalExpense, setTotalExpense] = useState(0);
  const [unpaidExpense, setUnpaidExpense] = useState(0);

  const totalExpenseDetails = async () => {
    await ApiCalls.getTotalExpense()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }
        setTotalExpense(res.data.Total);
      })
      .catch((err) => console.log(err));
  };

  const totalIndirectExpenseDetails = async () => {
    await ApiCalls.getUnpaidTotalExpense()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }
        setUnpaidExpense(res.data.Total);
      })
      .catch((err) => console.log(err));
  };
  useMemo(() => {
    totalExpenseDetails();
  }, []);
  useMemo(() => {
    totalIndirectExpenseDetails();
  }, []);

  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid container xs={12}>
        <Grid item md={6}>
          <Typography
            sx={{
              fontSize: "220%",
              color: "primary",
              padding: "20px",
              fontFamily: "Young Serif",
              color: "#2196f3",
            }}
          >
            Expense Record
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs>
        <Grid item md={0.2}></Grid>
        <Grid item xl={3} md={3} xs={5}>
          <Box
            sx={{
              marginTop: "20px",
              borderRadius: "25px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
              background: "#47a9f5",
              color: "white",
              marginLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: { md: "30px", xs: "1rem" }, fontWeight: "600" }}
              >
                Direct Expense
              </Typography>
              <img src={ExpenseImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{ fontSize: { md: "40px", xs: "1rem" }, fontWeight: "600" }}
              >
                ₹ {totalExpense && `${totalExpense}`}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: "50px", xs: "1rem" },
                  marginTop: "-20px",
                  fontWeight: "800",
                  color: "green",
                }}
              >
                ↑
              </Typography>
            </div>
          </Box>
        </Grid>
        <Grid item md={0.5}></Grid>
        <Grid item xl={3} md={3} xs={5}>
          <Box
            sx={{
              marginTop: "20px",
              borderRadius: "25px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
              background: "#47a9f5",
              color: "white",
              marginLeft: "20px",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: { md: "30px", xs: "1rem" }, fontWeight: "600" }}
              >
                Indirect Expense
              </Typography>
              <img src={ExpenseImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{ fontSize: { md: "40px", xs: "1rem" }, fontWeight: "600" }}
              >
                ₹ {unpaidExpense && `${unpaidExpense}`}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: "50px", xs: "1rem" },
                  marginTop: "-20px",
                  fontWeight: "800",
                  color: "green",
                }}
              >
                ↑
              </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Grid container xs={12}>
        <Grid item md={0.5}></Grid>
        <Grid item md={12}>
          <ExpenseRecord
            totalExpenseDetails={totalExpenseDetails}
            totalIndirectExpenseDetails={totalIndirectExpenseDetails}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
