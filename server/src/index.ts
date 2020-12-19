import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import cookieParser from "cookie-parser";
import cors from "cors";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken, setRefreshToken } from "./auth";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.get("/", (_, res) => {
    res.send("HELLO WORLD");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, `${process.env.REFRESH_TOKEN_SECRET}`);
    } catch (error) {
      console.log(error);
      return res.send({ ok: false, accessToken: "" });
    }
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.status(401).send("Invalid user id");
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).send("Invalid token version");
    }
    setRefreshToken(res, createRefreshToken(user));
    return res.send({
      ok: true,
      accessToken: createAccessToken(user),
    });
  });
  await createConnection();

  const apolloServer = new ApolloServer({
    // typeDefs: `
    //     type Query {
    //         hello: String!
    //     }
    // `,
    // resolvers: {
    //   Query: {
    //     hello: () => "hello world",
    //   },
    // },
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("express server started at port 4000...");
  });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
