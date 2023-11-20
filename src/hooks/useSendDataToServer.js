import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useSendDataToServer(endpoint) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    handleErrorDispay();
  }, [formData]);

  const handleErrorDispay = async () => {
    const res = await axios.post(endpoint, formData);
    if (!res.data.success) {
      setErrors(res.data.errors);
    } else {
      setErrors([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(endpoint);
      const res = await axios.post(endpoint, formData);

      console.log("Sended data to server successfully!");

      if (res.data.success) {
        setErrors([]);
        navigate("/");
      } else {
        setErrors(res.data.errors);
        console.log(res.data.errors);
        return navigate("/login");
      }
    } catch (err) {
      console.log("Error send data to server!");
    }
  };

  return [formData, handleInputChange, handleSubmit, errors];
}

export default useSendDataToServer;
