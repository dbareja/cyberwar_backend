const mongoose = require('mongoose');
const dns = require('dns');

mongoose.set('strictQuery', false);

const buildURI = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const host = process.env.MONGODB_HOST || '127.0.0.1';
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'cyberwar_blog';
  const query = process.env.MONGODB_QUERY ? `?${process.env.MONGODB_QUERY}` : '';

  return `mongodb://${host}:${port}/${database}${query}`;
};

const ensurePublicDNSForSRV = () => {
  const currentServers = dns.getServers();
  if (currentServers && currentServers.some(server => server.includes('127.0.0.1'))) {
    console.warn(
      'Local DNS server 127.0.0.1 detected — switching to Google public DNS for SRV lookups.'
    );
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
};

const connectDB = async () => {
  const uri = buildURI();
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    family: Number(process.env.MONGODB_IP_FAMILY) || 4,
  };

  try {
    ensurePublicDNSForSRV();
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(
      `MongoDB Connection Error (${error.message}). ` +
        'Verify MONGODB_URI or the host/port values and make sure MongoDB is reachable.'
    );
    process.exit(1);
  }
};

module.exports = connectDB;
