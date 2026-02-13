import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db
      .collection("item")
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          itemName: data.name,
          itemCategory: data.category,
          itemPrice: data.price
        }
      }
    );

    return NextResponse.json(
      { message: "Updated" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    await db.collection("item").deleteOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json(
      { message: "Deleted" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}
