import React, { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";
import { Routes } from "./Routes";

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (data) => {
      const { accessToken } = await data.json();
      setAccessToken(accessToken);
      setLoading(false);
    }).catch(error => {
        console.log(error);
    });
  }, []);
  if (loading) {
    return <div>loading app...</div>;
  }
  return <Routes />;
};
