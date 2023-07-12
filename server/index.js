const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const { USERS } = require("./users");
const { TODOS } = require("./todos");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type User{
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            user: User
        }

        type Query {
            getTodos: [Todo],
            getUsers: [User],
            getUser(id: ID!): User
        }
    `,
        resolvers: {
            Todo: {
                user: (todo) => USERS.find((e) => e.id === todo.id)

            },
            Query: {
                getTodos: () => TODOS,
                getUsers: () => USERS,
                getUser: (parent, { id }) => USERS.find((e) => e.id === id)
            }
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(3000, () => console.log("Server Started at PORT 3000"));
}

startServer();