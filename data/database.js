const {MongoClient} = require("mongodb");

let mongodbUrl = 'mongodb://localhost:27017'

//la env variabile viene creata sull'eventuale server esterno

if(process.env.MONGODB_URL){
  mongodbUrl = process.env.MONGODB_URL;
}

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw { message: 'You must connect first!' };
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};