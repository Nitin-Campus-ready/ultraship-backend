import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { typeDefs, resolvers } from "./model/schema.js";
import { getUserFromRequest } from "./statergies/jwt-stratergies.js";
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function start() {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = getUserFromRequest(req);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
