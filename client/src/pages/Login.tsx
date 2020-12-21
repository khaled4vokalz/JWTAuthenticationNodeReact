import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { setAccessToken } from "../accessToken";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await login({
          variables: {
            email,
            password,
          },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                me: data.login.user,
              },
            });
          },
        });
        console.log(response);
        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
        }
        history.push("/");
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
      <button type="submit">Login</button>
    </form>
  );
};
