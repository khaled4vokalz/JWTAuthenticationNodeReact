import { verify } from "jsonwebtoken";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "./MyContext";

export const isAuth: Middleware<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  try {
    if (!authorization) {
      throw new Error("Invalid authorization request");
    }
    const token = authorization.split(" ")[1];
    const payload = verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    context.payload = payload as any;
  } catch (error) {
    console.log(error);
    throw new Error("could not authenticate user");
  }
  return next();
};
