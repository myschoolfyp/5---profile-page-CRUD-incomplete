import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

// POST function to add a new student
export async function POST(request: Request) {
  let client: MongoClient | null = null;
  try {
    const student = await request.json();
    const { id, name, class: className, contact, subjects } = student;

    // Validate request body
    if (!id || !name || !className || !contact || !subjects) {
      return NextResponse.json(
        { message: "Missing required fields: id, name, class, contact, subjects", error: true },
        { status: 400 }
      );
    }
    

    // Connect to MongoDB
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    // Check if student with the same ID already exists
    const existingStudent = await db.collection("students").findOne({ id });


    if (existingStudent) {
      return NextResponse.json(
        { message: "Student ID already exists" },
        { status: 200 }
      );
    }

    // Add new student if ID doesn't exist
    const newStudent = {
      id,
      name,
      class: className,
      contact,
      subjects: subjects.split(",").map((subject: string) => subject.trim()), // Convert subjects to array
    };

    const result = await db.collection("students").insertOne(newStudent);

    if (result.insertedId) {
      return NextResponse.json(
        { message: "Student added successfully", student: newStudent, error: false },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to add student to the database");
    }
  } catch (error: any) {
    // Log the error and return a response with details
    console.error("Error in POST /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + (error.message || "Unknown error"), error: true },
      { status: 500 }
    );
  } finally {
    // Ensure the MongoDB client is closed
    if (client) {
      await client.close();
    }
  }
}

// GET function to retrieve students (can be reused if needed)
export async function GET() {
  let client: MongoClient | null = null;
  try {
    // Connect to MongoDB
    client = new MongoClient(mongoUri);
    await client.connect();

    // Get the list of students
    const db = client.db();
    const students = await db.collection("students").find().toArray();

    // Return students as JSON
    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    // Log the error and return a failure response
    console.error("Error in GET /api/students:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error: " + (error.message || "Failed to fetch students"), error: true },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
