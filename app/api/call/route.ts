import { NextResponse } from "next/server";
import Vapi from "@vapi-ai/web";

export async function GET(req: Request) {
  return new Response("Hello, world!");
}
