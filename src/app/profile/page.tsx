"use client"
import axios from "axios"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
    const router = useRouter()
    const [data, setData] = useState("nothing")

    const logout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("Logout successful")
            router.push("/login")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error.message)
            toast.error(error.message)
        }
    }

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/users/me")
            console.log(res.data)
            setData(res.data.data._id)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error("Failed to fetch user details", error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Profile</h1>
                <p className="text-gray-600 mb-6">This is your profile dashboard</p>

                <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">User ID</h2>
                    <div className="bg-green-100 text-green-800 font-mono p-3 rounded-lg break-words">
                        {data === "nothing" ? (
                            "No data available"
                        ) : (
                            <Link
                                href={`/profile/${data}`}
                                className="underline text-blue-700 hover:text-blue-900 transition"
                            >
                                {data}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-4 mt-6">
                    <button
                        onClick={getUserDetails}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Get User Details
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
