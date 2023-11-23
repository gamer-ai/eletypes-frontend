import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function useSendDataToServer(endpoint) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    submit: false,
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // update display errors
    handleErrorDispay();
  }, [formData]);

  const saveAccount = async () => {
    setFormData({ ...formData, submit: true });

    const res = await axios.post(endpoint, formData);

    if (!res.data.success) return setErrors(res.data.errors);

    setErrors([]);

    navigate("/login");
  };

  const loginSubmit = async () => {
    setFormData({ ...formData, submit: true });

    const res = await axios.post(endpoint, formData);

    if (!res.data.success) return setErrors(res.data.errors);
     
    setErrors([]);

    navigate('/')
  };

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
      } else {
        setErrors(res.data.errors);
        return navigate(res.data.url);
      }
    } catch (err) {
      console.log("Error send data to server!");
    }
  };

  return [
    formData,
    handleInputChange,
    handleSubmit,
    errors,
    saveAccount,
    loginSubmit,
  ];
}

export default useSendDataToServer;
