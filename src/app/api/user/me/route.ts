import { dbConnect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import  { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        await dbConnect();
        const userId = getDataFromToken(request);
        const user = await User.findById({ _id: userId }).select("-password");
        return NextResponse.json({
            message: "User fetched successfully",
            data: user
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        return NextResponse.json({ error: err?.message ?? "Internal Server Error" }, { status: 500 });
    }
}
