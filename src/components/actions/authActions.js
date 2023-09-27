import axios from "axios";

export const register = (formData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3001/send-otp", formData);
    const { token } = response.data;
    localStorage.setItem("token", token);
    dispatch({ type: "REGISTER_SUCCESS", payload: token });
  } catch (error) {
    dispatch({ type: "REGISTER_FAILURE", payload: error.message });
  }
};

