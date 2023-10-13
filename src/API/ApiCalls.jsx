import axios from "axios";

export default {
  getTotalIncome: async function () {
    try {
      const response = await axios.get(
        `http://localhost:8099/income/getTotalIncomeRate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );
      return response;
    } catch (err) {
      return err;
    }
  },
  getUnpaidTotalIncome: async function () {
    try {
      const response = await axios.get(
        `http://localhost:8099/income/getUnpaidTotalIncomeRate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );

      return response;
    } catch (err) {
      return err;
    }
  },

  getTotalExpense: async function () {
    try {
      const response = await axios.get(
        `http://localhost:8099/expense/getDirectTotalExpenseRate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );
      return response;
    } catch (err) {
      return err;
    }
  },
  getUnpaidTotalExpense: async function () {
    try {
      const response = await axios.get(
        `http://localhost:8099/expense/getIndirectTotalExpenseRate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );
      return response;
    } catch (err) {
      return err;
    }
  },
};
