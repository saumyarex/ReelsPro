import mongoose from "mongoose";

const MONGO_URI : string = process.env.MONGOURI || "";

if(!MONGO_URI){
    throw new Error("Please provide MongoDB URI in .env")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { connection : null, promise : null}
}


export default async function DbConnect() {

    if(cached.connection){
        console.log(cached.connection)
        return cached.connection;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands : true,
            maxPoolSize : 10,
        }

        cached.promise =  mongoose.connect(`${MONGO_URI}/reelspro`,opts).then( () => mongoose.connection)
    }

    try {

        cached.connection = await cached.promise;
        
    } catch (error) {
        console.log("DB Connection error : ", error)
        cached.promise = null;
        throw error
    }

    return cached.connection;
}


