import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function GET(req) {
  const headers = {
    "Cache-Control": "no-store",
    ...corsHeaders
  };

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db
      .collection("item")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(result, { headers });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  const data = await req.json();

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").insertOne({
      itemName: data.name,
      itemCategory: data.category,
      itemPrice: data.price,
      status: "ACTIVE"
    });

    return NextResponse.json(
      { id: result.insertedId },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}
