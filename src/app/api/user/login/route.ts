import { dbConnect } from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const { TOKEN_SECRET } = process.env;
    if (!TOKEN_SECRET) {
      return NextResponse.json({ error: "Server misconfiguration: TOKEN_SECRET not set" }, { status: 500 });
    }
   // Create a JWT token
   const tokenData ={
    id: user._id,
    username: user.username,
    email: user.email
   }
   // Create a token
  const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({
    message: "Login successful",
    success: true,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
 
  });
  return response;

  } catch (error: any) {
    const msg = typeof error?.message === "string" ? error.message : "Internal Server Error";
    const isDB = (error?.name === "MongooseServerSelectionError") || /ECONNREFUSED|MongooseServerSelectionError/i.test(msg);
    const status = isDB ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
