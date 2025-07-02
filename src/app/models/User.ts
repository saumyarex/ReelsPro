import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id?: mongoose.Types.ObjectId,
    email: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export const UserShema =  new Schema<IUser>(
    {
        email : {
        type : String,
        required : true,
        unique : true
        },
        password : {
            type : String,
            required : true,
        },
    },
    {
        timestamps: true
    }
)

UserShema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
} )

const User = models?.User || model("User", UserShema);

export default User;