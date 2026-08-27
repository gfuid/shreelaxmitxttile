import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srivijaylaxmi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 If using MongoDB Atlas, make sure 0.0.0.0/0 (Allow Access from Anywhere) is active in Network Access: https://cloud.mongodb.com/');
    
    // Auto-retry once after 4 seconds
    setTimeout(async () => {
      try {
        console.log('🔄 Retrying MongoDB connection...');
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
        console.log(`✅ MongoDB Re-connected: ${conn.connection.host}`);
      } catch (err) {
        console.error(`❌ MongoDB Retry Failed: ${err.message}`);
      }
    }, 4000);
  }
};

export default connectDB;
