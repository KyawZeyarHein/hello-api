import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const item = await db.collection("item").findOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json(item, {
      headers: corsHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    await db.collection("item").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function PUT(req, { params }) {
  const data = await req.json();

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    await db.collection("item").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          itemName: data.name,
          itemCategory: data.category,
          itemPrice: data.price,
          status: data.status,
        },
      }
    );

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}
