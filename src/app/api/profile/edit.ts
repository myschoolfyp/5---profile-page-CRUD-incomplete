import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function POST(request: Request) {
  const client = new MongoClient(mongoUri);
  try {
    const { email, userType, password } = await request.json();


    await client.connect();
    const db = client.db();
    let user;

    if (userType === "Admin") {
      user = await db.collection("admins").findOne({ email });
    } else if (userType === "Teacher") {
      user = await db.collection("teachers").findOne({ email });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found", error: true }, { status: 404 });
    }
    console.log("User password (hashed):", user.password);

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect password", error: true }, { status: 401 });
    }

    // Return user data for editing
    const { firstName, lastName, contactNumber } = user;
    return NextResponse.json({ firstName, lastName, contactNumber, error: false }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal server error", error: true }, { status: 500 });
  } finally {
    await client.close();
  }
}
