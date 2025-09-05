import { info, log,  } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
  isConnect?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnect) {
    log("Already connected to the database");
    return;
  }

  try {
    //Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});

    connection.isConnect = db.connections[0].readyState;
    info("Database connected successfully");
  } catch (error) {
    console.error("Database Connection Failed", error)
    
    // Graceful exit in case of a connection error
    process.exit();
  }
}

export default dbConnect
