import { dbConnect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import  { NextRequest, NextResponse } from "next/server";

dbConnect();

export const GET = async (request: NextRequest) => {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById({_id: userId}).select("-password");
        return NextResponse.json({
             message : "User fetched successfully",
            data : user
        });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message ?? "Internal Server Error" }, { status: 500 });
    }
}