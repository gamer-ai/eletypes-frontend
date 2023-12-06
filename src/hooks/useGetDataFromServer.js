import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function useGetDataFromServer(defaultValue, url, category) {
  const [data, setData] = useState(defaultValue);
  const [cookies, setCookie] = useCookies();
  const token = cookies.token;
  const selectedUserId = JSON.parse(
    window.localStorage.getItem("selected-user-id")
  );

  const fetchData = async () => {
    try {
      const res =
        category === "ranking"
          ? await axios.get(url)
          : category === "user-profile-detail"
          ? await axios.get(url + `/${selectedUserId}`)
          : token &&
            category === "profile" &&
            (await axios.get(url + `/${token}`, {
              headers: { authorization: token },
            }));

      setData(res.data.payload);

      console.log("Sucessfully got data from server!");
    } catch (err) {
      console.log("Error fetching data from server!");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, category]);

  return data;
}

export default useGetDataFromServer;
