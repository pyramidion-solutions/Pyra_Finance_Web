import React from "react";
import { Grid } from "@mui/material";
import Income from "./Income";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ApiCalls from "../API/ApiCalls";
import IncomeImg from "../../src/assets/Images/income.png";
import { useNavigate } from "react-router-dom";
export default function IncomeDashboard() {
  const navigate = useNavigate();
  const [totalIncome, setTotalIncome] = useState(0);
  const [unpaidIncome, setUnpaidIncome] = useState(0);

  useEffect(() => {
    totalunpaidincomecall();
  }, []);
  useEffect(() => {
    totalIncomecall();
  }, []);

  const totalunpaidincomecall = async () => {
    await ApiCalls.getUnpaidTotalIncome()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }

        setUnpaidIncome(res.data.Total);
      })
      .catch((err) => console.log(err));
  };
  const totalIncomecall = async () => {
    await ApiCalls.getTotalIncome()
      .then((res) => {
        if (
          (res && res.status == 401) ||
          (res.response && res.response.status == 401)
        ) {
          navigate("/login");
        }

        setTotalIncome(res.data?.Total);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid container xs={12}>
        <Grid item md={6} xs={3}>
          <Typography
            sx={{
              fontSize: "220%",
              color: "primary",
              padding: "20px",
              fontFamily: "Young Serif",
              color: "#2196f3",
            }}
          >
            Income Outstanding
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs>
        <Grid item md={0.2}></Grid>
        <Grid item xl={3} md={3} xs={2}>
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
                Paid Income
              </Typography>
              <img src={IncomeImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{ fontSize: { md: "40px", xs: "1rem" }, fontWeight: "600" }}
              >
                ₹ {totalIncome ? `${totalIncome}` : 0}
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
                Outstanding Income
              </Typography>
              <img src={IncomeImg} alt="" />
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                sx={{ fontSize: { md: "40px", xs: "1rem" }, fontWeight: "600" }}
              >
                ₹ {unpaidIncome ? `${unpaidIncome}` : 0}
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
          <Income
            totalIncomecall={totalIncomecall}
            totalunpaidincomecall={totalunpaidincomecall}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
