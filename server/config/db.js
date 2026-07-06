import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gavyadhenu';
  const fallbackUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/gavyadhenu';
  const connectOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    connectTimeoutMS: 10000,
  };

  mongoose.connection.on('connected', () => {
    console.log(`✓ MongoDB connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✓ MongoDB reconnected');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Reconnection will be attempted automatically.');
  });

  mongoose.connection.on('error', (error) => {
    console.error('✗ MongoDB connection error event:', error.message);
  });

  const tryConnect = async (uri) => {
    try {
      await mongoose.connect(uri, connectOptions);
      console.log(`✓ Connected to ${uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'MongoDB'} (${uri})`);
      return true;
    } catch (error) {
      console.error(`✗ Connection to ${uri} failed:`, error.message);
      return false;
    }
  };

  // Keep trying until one URI succeeds. This prevents the server from exiting after a reboot
  // when network or local MongoDB may not be immediately available.
  while (true) {
    if (await tryConnect(primaryUri)) return;
    if (primaryUri !== fallbackUri && (await tryConnect(fallbackUri))) return;
    const delayMs = Number(process.env.DB_RETRY_DELAY_MS) || 5000;
    console.log(`ℹ️ Retrying DB connection in ${delayMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
};

export default connectDB;
