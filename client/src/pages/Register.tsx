import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";

export const Register: React.FC<RouteComponentProps> = ({history}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await register({
          variables: {
            email,
            password,
          },
        });
        history.push('/');
        console.log(response);
      }}
    >
      <div>
        <input
          type="email"
          value={email}
          placeholder="Enter email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};
