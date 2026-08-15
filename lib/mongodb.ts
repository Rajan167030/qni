/**
 * QNexus — Safe MongoDB / Mongoose Connection Helper
 * 
 * Instructions to connect MongoDB later:
 * 1. Create `.env.local` in `qni/` folder
 * 2. Add: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/qnexus?retryWrites=true&w=majority
 * 
 * If MONGODB_URI is not provided, the application runs seamlessly using the fallback storage.
 */

const uri = process.env.MONGODB_URI;

export async function getMongoDbClient() {
  if (!uri) {
    return null;
  }
  
  try {
    // Dynamic import to prevent build errors when package is optional
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri);
    await client.connect();
    return client;
  } catch (error) {
    console.warn('MongoDB connection attempted but driver package is not installed or URI is invalid.', error);
    return null;
  }
}

export async function getMongoDbDatabase(dbName = 'qnexus') {
  const client = await getMongoDbClient();
  if (!client) return null;
  return client.db(dbName);
}

export default getMongoDbClient;
