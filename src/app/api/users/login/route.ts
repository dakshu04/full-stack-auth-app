import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        console.log(reqBody)

        // check if user exists or not
        const user = await User.findOne({
            email
        })

        if(!user) {
            return NextResponse.json({error: "User does not exists"}, {status : 400})
        }
        //password is coming from req.body and user.password come from database
        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword) {
            return NextResponse.json({error: "Invalid Password"}, {status : 400})
        }

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        //create token
        console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET)
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });


        const response = NextResponse.json({
            message: "Login successful",
            success: true
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        })
    }
}
