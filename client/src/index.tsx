import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { ApolloProvider } from "@apollo/react-hooks";
import { getAccessToken, setAccessToken } from "./accessToken";
import { App } from "./App";
import jwtDecode, { JwtPayload } from "jwt-decode";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = ApolloLink.from([
  new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
      try {
        const token = getAccessToken();
        if (!token) {
          return true;
        }
        const { exp } = jwtDecode<JwtPayload>(token);
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include",
      });
    },
    handleFetch: (accessToken) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn("Your refresh token is invalid. Try to relogin");
      console.error(err);
    },
  }),
  authLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
