import { dbConnect } from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";


export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

     //Send verification email
     await sendEmail({ email: savedUser.email, emailType:"VERIFY", userId: savedUser._id });

    return NextResponse.json({ message: "User created successfully", success: true, savedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
