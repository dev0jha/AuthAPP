import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
        if (typeof decoded === "string" || !decoded || typeof decoded !== "object" || !("id" in decoded)) {
            throw new Error("Invalid token");
        }
        return (decoded as jwt.JwtPayload & { id: string }).id;
    } catch (error: unknown) {
        const err = error as { message?: string };
        throw new Error(err?.message ?? "Internal Server Error");
    }
}
