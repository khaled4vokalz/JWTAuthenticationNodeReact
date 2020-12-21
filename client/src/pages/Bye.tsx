import React from "react";
import { useByeQuery } from "../generated/graphql";

export const Bye: React.FC = () => {
  const { data, loading, error } = useByeQuery({ fetchPolicy: "network-only" });
  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>ERROR HAPPENED! :( </div>;
  }

  if (!data) {
    return <div>No DATA found!</div>;
  }
  return <div>{data.bye}</div>;
};
