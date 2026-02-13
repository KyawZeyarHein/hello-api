import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// =======================
// GET ONE ITEM
// =======================
export async function GET(req, context) {
  const { params } = context;
  const id = params.id;

  const headers = {
    "Cache-Control": "no-store",
    ...corsHeaders
  };

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const item = await db.collection("item").findOne({
      _id: new ObjectId(id)
    });

    if (!item) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(item, { headers });

  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers }
    );
  }
}

// =======================
// UPDATE ITEM
// =======================
export async function PATCH(req, context) {
  const { params } = context;
  const id = params.id;

  try {
    const data = await req.json();

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          itemName: data.name,
          itemCategory: data.category,
          itemPrice: data.price
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Updated successfully" },
      { headers: corsHeaders }
    );

  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

// =======================
// DELETE ITEM
// =======================
export async function DELETE(req, context) {
  const { params } = context;
  const id = params.id;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    await db.collection("item").deleteOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { headers: corsHeaders }
    );

  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}
