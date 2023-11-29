import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function useGetDataFromServer(defaultValue, url) {
  const [data, setData] = useState(defaultValue);
  const [cookies, setCookie] = useCookies();
  const token = cookies.token;

  const fetchData = async () => {
    try {
      const res = await axios.get(url, {
        headers: { authorization: token },
      });

      setData(res.data.users);

      console.log("Sucessfully got data from server!");
    } catch (err) {
      console.log("Error fetching data from server!");
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  return data;
}

export default useGetDataFromServer;
