process.loadEnvFile()
const { MongoClient } = require('mongodb');
let client;
let db;

const connectToMongoDB = async (req, res, next) => {
  try {
      if (!client) {
          client = new MongoClient(process.env.MONGODB_URLSTRING);
          await client.connect();
          db = client.db(process.env.DATABASE_NAME);
          console.log('Conectado a MongoDB');
      }
      req.db = db.collection(process.env.COLLECTION_NAME);
      next();
  } catch (error) {
      console.error('Error al conectarse a MongoDB', error);
      res.status(500).json({ message: 'Error al conectarse a la base de datos' });
  }
};

const disconnectFromMongoDB = async (req, res, next) => {
  try {
      if (client) {
          await client.close();
          client = null;
          db = null;
          console.log('Desconectado de MongoDB');
      }
      next();
  } catch (error) {
      console.error('Error al desconectarse de MongoDB', error);
  }
};
  

module.exports = {connectToMongoDB, disconnectFromMongoDB}
