import { useState } from "react";

function useGetBackendReady() {
  const [backendReady, setBackendReady] = useState(false);

  return backendReady;
}

export default useGetBackendReady;































