process.loadEnvFile()
const mongoose = require('mongoose')


const connectToMongoDB = async (req, res, next) => {
    try {
        await mongoose.connect(process.env.MONGODB_URLSTRING);
        req.db = mongoose.connection;
        next();
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        res.status(500).json({ message: 'Error al conectar a MongoDB' });
    }
};

const disconnectFromMongoDB = async (req, res, next) => {
    try {
        await mongoose.disconnect();
        next();
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error);
        res.status(500).json({ message: 'Error al desconectar de MongoDB' });
    }
};


module.exports = { connectToMongoDB, disconnectFromMongoDB }
