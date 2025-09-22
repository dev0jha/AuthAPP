import { dbConnect } from "@/app/dbConfig/dbConfig";
import { NextResponse , NextRequest } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const { token } = reqbody;
        console.log(token);
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now()}})
        if(!user) return NextResponse.json({message:"Invalid or expired token"},{status:400});
        console.log(user);
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({
            message:"Email verified successfully",
            success:true},
            {
                status:200
            }
        );
    } catch (error: unknown) {
        const err = error as { message?: string };
        return NextResponse.json({
            message: err?.message ?? "Internal Server Error",
            success: false
        }, {
            status: 500
        });
    }
}
