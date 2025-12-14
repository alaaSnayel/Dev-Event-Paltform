import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "../../database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data form" },
        { status: 400 }
      );
    }

    const createEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error handling POST /api/events:", e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 }
    );
  }
}
