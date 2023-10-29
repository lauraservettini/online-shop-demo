const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

function createSessionStore(session) {
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
    uri: "mongodb://localhost:27017",
    databaseName: "online-shop",
    collection: "sessions",
  });

  return sessionStore;
}

function createSessionConfig(sessionStore) {
  return {
    secret: "really-super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,// tempo di vita della sessione
    },
  };
}

module.exports = {
  createSessionStore: createSessionStore,
  createSessionConfig: createSessionConfig,
};
