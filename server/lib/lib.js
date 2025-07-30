import mongoose from "mongoose";

const connectDb = async (uri) => {
  try {
    const data = await mongoose.connect(uri);
    console.log(`Database connected successfully ${data.connection.host} `);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
  }
};

export { connectDb };
