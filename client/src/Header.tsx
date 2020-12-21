import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "./accessToken";
import { useLogoutMutation, useMeQuery } from "./generated/graphql";

export const Header: React.FC = () => {
  const { data } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  return (
    <header>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/bye">Bye</Link>
      </div>
      <div>
        {data && data.me && (
          <button
            onClick={async () => {
              await logout();
              setAccessToken("");
              await client!.resetStore();
            }}
          >
            logout
          </button>
        )}
      </div>
      {data && data.me ? <div>You are logged in as {data.me.email}</div> : null}
    </header>
  );
};
