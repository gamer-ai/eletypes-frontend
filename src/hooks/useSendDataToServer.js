import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useSendDataToServer(endpoint) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(endpoint)
      const res = await axios.post(endpoint, formData);

      console.log("Sended data to server successfully!");
      console.log(res.data.success)
      if(res.data.success) return navigate("/");
    } catch (err) {
      console.log("Error send data to server!");
    }
  };

  return [formData, handleInputChange, handleSubmit];
}

export default useSendDataToServer;
