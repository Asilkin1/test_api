const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const { MongoClient } = require('mongodb');

// Set variables necessary for mongo connection
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

let client: { db: (arg0: string | undefined) => any; close: () => any; };

async function connectMongo() {
    try {
        // One instance
        client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Rethrow error to handle it in the calling code
    }
}

function getCollection(collection: any) {
    const db = client.db(dbName);
    return db.collection(collection);
}

async function closeMongo() {
    if (client) {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = {
    connectMongo,
    getCollection,
    closeMongo,
};
