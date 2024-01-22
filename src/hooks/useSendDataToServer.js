import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function useSendDataToServer(endpoint) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    submit: false,
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

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

        res.data.action === "login" &&
          setCookie("token", res.data.token, {
            path: "/",
          });

        navigate(res.data.url);
      } else {
        setErrors(res.data.errors);
        return navigate(res.data.url);
      }
    } catch (err) {
      console.log("Error send data to server!");
    }
  };

  return [formData, handleInputChange, handleSubmit, errors];
}

export default useSendDataToServer;
