import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import DbConnect from "./DbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";


export const authOption : NextAuthOptions = {
    providers : [
    CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email", placeholder: "Enter your email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {

        if(!credentials?.email || !credentials?.password){
            throw new Error("Please provide email and password")
        }
        await DbConnect();

        try {
            const user = await User.findOne({email : credentials.email})
            if(!user){
                throw new Error("User not found")
            }
    
            const validatePassword = await bcrypt.compare(credentials.password, user.password)
    
            if(!validatePassword){
                throw new Error("Invalid password. Please check")
            }
    
            return {
                id: user._id.toString(),
                email : user.email
            };
        } catch (error: unknown) {
            throw error 
        }

    }
  })
],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
            }
           return token;
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session : {
        strategy:"jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    pages: {
        signIn : "/login",
        error: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
}