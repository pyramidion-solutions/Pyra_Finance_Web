import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Menu, MenuItem } from "@mui/material";
import Axios from "axios";
import ApiCalls from "../../API/ApiCalls";
import { useMemo } from "react";
import { Date } from "core-js";
import IncomeImg from "../../assets/Images/income.png";
import ExpenseImg from "../../assets/Images/expense.png";
import PfImg from "../../assets/Images/profit and loss.png";
import { useNavigate } from "react-router-dom";
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
});

const Dashboard = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [newRowData, setNewRowData] = useState({
    account: "",
    limit_amount: "",
    balance: "",
    date: "",
  });

  const [editMode, setEditMode] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const style = totalIncome - totalExpense < 0 ? "redcolor" : "greencolor";

  const handleAddRow = () => {
    setNewRowData({
      account: "",
      limit_amount: "",
      balance: "",
      date: "",
    });
    setAddDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "account") {
      setNewRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "limit_amount" || name === "balance") {
      if (!isNaN(value)) {
        setNewRowData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "date") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        setNewRowData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const handleAddButtonClick = async () => {
    const newData = {
      account: newRowData.account,
      limit_amount: newRowData.limit_amount,
      balance: newRowData.balance,
      date: newRowData.date,
    };

    if (
      newData.account &&
      newData.limit_amount &&
      newData.balance &&
      newData.date
    ) {
      try {
        await Axios({
          url: "http://localhost:8099/account/api/account-summary",
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
          data: newData,
        }).then((response) => {
          if (response.status === 200) {
            setTableData((prevTableData) => [...prevTableData, newData]);
            setAddDialogOpen(false);
          } else {
            console.error("Error adding data to the API");
          }
        });
      } catch (error) {
        if (error && error.response.status == 401) {
          navigate("/login");
        }
      }
    } else {
      console.error("All fields are required!");
    }
  };

  const toggleEditMode = (index) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: !prevEditMode[index],
    }));
  };

  const handleRowInputChange = async (event, index) => {
    const { name, value } = event.target;
    // Regular expressions for validation
    const accountRegex = /^[A-Za-z0-9]+$/;
    const amountRegex = /^[0-9]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let updatedTableData = [...tableData];
    // Validate input values based on their names
    if (name === "account" && !accountRegex.test(value)) {
      // Invalid account format
      console.error("Invalid account format. Use only letters and numbers.");
      return;
    } else if (
      (name === "limit_amount" || name === "balance") &&
      !amountRegex.test(value)
    ) {
      // Invalid amount format
      console.error("Invalid amount format. Use only numbers.");
      return;
    } else if (name === "date" && !dateRegex.test(value)) {
      // Invalid date format
      console.error("Invalid date format. Use YYYY-MM-DD format.");
      return;
    }
    updatedTableData[index] = {
      ...updatedTableData[index],
      [name.split("-")[0]]: value,
    };
    if (editMode[index]) {
      try {
        await Axios({
          url: `http://localhost:8099/account/api/account-summary/${updatedTableData[index].id}`,
          method: "put",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
          data: {
            account: updatedTableData[index].account,
            limit_amount: updatedTableData[index].limit_amount,
            balance: updatedTableData[index].balance,
            date: updatedTableData[index].date,
          },
        }).then((response) => {
          if (response.status === 200) {
          } else if (
            response &&
            response.response &&
            response.response.status == 401
          ) {
            navigate("/login");
          } else {
            console.error("Error updating record");
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setTableData(updatedTableData);
  };

  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);

  const handleDownloadClick = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet([
      ["Account", "Limit", "Balance", "Date"],
      ...tableData.map((row) => [
        row.account,
        row.limit_amount,
        row.balance,
        new Date(row.date).toLocaleDateString(),
      ]),
      [
        "Total",
        calculateTotal().totalLimit,
        calculateTotal().totalBalance,
        "-",
      ],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");
    XLSX.writeFile(wb, "Account_summary.xlsx");
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Account Summary", 10, 10);
    const columns = ["Account", "Limit", "Balance", "Date"];
    const data = tableData.map((row) => [
      row.account,
      row.limit_amount,
      row.balance,
      new Date(row.date).toLocaleDateString(),
    ]);

    const totalRow = [
      "Total",
      calculateTotal().totalLimit,
      calculateTotal().totalBalance,
      "-",
    ];
    data.push(totalRow);
    const margin = 10;
    doc.autoTable({
      head: [columns],
      body: data,
      startY: 20,
      margin: { top: margin },
    });
    doc.save("Account_summary.pdf");
  };

  const fetchData = async () => {
    try {
      await Axios({
        url: "http://localhost:8099/account/api/account-summary",
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setTableData(response.data);
        } else {
          console.error("Error fetching data from the API");
        }
      });
    } catch (error) {
      if (error && error.response.status == 401) {
        navigate("/login");
      } else {
        console.error("All fields are required!");
      }
    }
  };

  const handleDeleteRow = async (index, accountId) => {
    try {
      await Axios({
        url: `http://localhost:8099/account/api/account-summary/${accountId}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
        },
      }).then((response) => {
        if (!accountId) {
          const updatedTableData = [...tableData];
          updatedTableData.splice(index, 1);
          setTableData(updatedTableData);
        } else {
          if (response.status == 200) {
            fetchData();
          } else {
            console.error("Error deleting data from the API");
          }
        }
      });
    } catch (error) {
      if (error && error.response.status == 401) {
        navigate("/login");
      } else {
        console.error("All fields are required!");
      }
    }
  };
  const calculateTotal = () => {
    let totalLimit = 0;
    let totalBalance = 0;
    for (const row of tableData) {
      totalLimit += parseFloat(row.limit_amount);
      totalBalance += parseFloat(row.balance);
    }
    return { totalLimit, totalBalance };
  };

  useEffect(() => {
    fetchData();
  }, []);
  const gettotalIncome = async () => {
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

  const gettotalExpense = async () => {
    await ApiCalls.getTotalExpense()
      .then((res) => {
        if (res && res.response && res.response.status == 401) {
          window.alert("Invalid user");
          navigate("/login");
        }
        setTotalExpense(res.data?.Total);
      })
      .catch((err) => console.log(err));
  };
  useMemo(() => {
    gettotalIncome();
  }, []);

  useMemo(() => {
    gettotalExpense();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container>
          <Typography
            sx={{
              fontSize: "220%",
              color: "primary",
              padding: "20px",
              fontFamily: "Young Serif",
              color: "#2196f3",
            }}
          >
            Dashboard
          </Typography>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "300px",
                  boxShadow: "10px 10px 4px 0px #00000050",

                  borderRadius: "25px",
                  display: { xs: "block", md: "block" },
                  height: "150px",
                  paddingLeft: "20px",
                  background: "#47A9F5",
                  color: "white",
                  marginLeft: "20px",
                  paddingTop: "10px",
                  marginRight: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  Income
                  <img src={IncomeImg} alt="" style={{ height: "30px" }} />
                </Typography>

                <Typography
                  sx={{
                    color: "green",
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  Rs.{totalIncome}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "300px",
                  boxShadow: "10px 10px 4px 0px #00000050",

                  borderRadius: "25px",
                  display: { xs: "block", md: "block" },
                  height: "150px",
                  paddingLeft: "20px",
                  background: "#47A9F5",
                  color: "white",
                  marginLeft: "20px",
                  paddingTop: "10px",
                  marginRight: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  Expenses
                  <img src={ExpenseImg} alt="" />
                </Typography>

                <Typography
                  sx={{
                    color: "green",
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  Rs.{totalExpense}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  width: "300px",
                  boxShadow: "10px 10px 4px 0px #00000050",

                  marginTop: "0px",

                  borderRadius: "25px",
                  display: { xs: "block", md: "block" },
                  height: "150px",
                  paddingLeft: "20px",
                  background: "#47A9F5",
                  color: "white",
                  marginLeft: "20px",
                  paddingTop: "10px",
                  marginRight: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  Profit/Loss
                  <img src={PfImg} alt="" style={{ height: "30px" }} />
                </Typography>

                <Typography
                  className={style}
                  sx={{
                    fontSize: { md: "40px", xs: "1rem" },
                    fontFamily: "Young Serif",
                  }}
                >
                  {totalIncome - totalExpense}
                </Typography>
              </Box>
            </Grid>
          </div>
          <div>
            <h2 style={{ fontFamily: "Young Serif" }}>Account Summary</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <IconButton
                  aria-label="Add"
                  onClick={handleAddRow}
                  style={{
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </div>
              <div>
                <IconButton
                  aria-label="Download"
                  onClick={handleDownloadClick}
                  style={{
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <GetAppIcon />
                </IconButton>

                <Menu
                  anchorEl={downloadMenuAnchor}
                  open={Boolean(downloadMenuAnchor)}
                  onClose={handleDownloadMenuClose}
                >
                  <MenuItem onClick={generatePdf}>Download as PDF</MenuItem>
                  <MenuItem onClick={handleExportToExcel}>
                    Download as Excel
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <TableContainer
              style={{
                border: "3px solid #000000",
                width: "100%",
                overflowX: "auto",
                marginBottom: "20px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Account
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Limit
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Balance
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Edit
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody
                  style={{
                    fontSize: "25px",
                  }}
                >
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {editMode[index] ? (
                          <TextField
                            name={`account-${index}`}
                            value={row.account}
                            onChange={(e) => handleRowInputChange(e, index)}
                          />
                        ) : (
                          row.account
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode[index] ? (
                          <TextField
                            name={`limit_amount-${index}`}
                            value={row.limit_amount}
                            onChange={(e) => handleRowInputChange(e, index)}
                          />
                        ) : (
                          row.limit_amount
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode[index] ? (
                          <TextField
                            name={`balance-${index}`}
                            value={row.balance}
                            onChange={(e) => handleRowInputChange(e, index)}
                          />
                        ) : (
                          row.balance
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode[index] ? (
                          <TextField
                            name={`date-${index}`}
                            type="date"
                            value={row.date}
                            onChange={(e) => handleRowInputChange(e, index)}
                          />
                        ) : (
                          new Date(row.date).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label={editMode[index] ? "Save" : "Edit"}
                          onClick={() => toggleEditMode(index)}
                        >
                          {editMode[index] ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => handleDeleteRow(index, row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      {calculateTotal().totalLimit}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      {calculateTotal().totalBalance}
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      -
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        background: "#676767",
                      }}
                    >
                      -
                    </TableCell>{" "}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onClose={() => setAddDialogOpen(false)}
          >
            <DialogTitle>Add a New Row</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the details for the new row:
              </DialogContentText>
              <TextField
                name="account"
                placeholder="Account"
                value={newRowData.account}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="limit_amount"
                placeholder="Limit"
                value={newRowData.limit_amount}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="balance"
                placeholder="Balance"
                value={newRowData.balance}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="date"
                placeholder="Date"
                type="date"
                value={newRowData.date}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddButtonClick}>Add</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
