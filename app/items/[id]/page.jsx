"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ItemEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();

  async function loadItem() {
    const res = await fetch(`/api/item/${id}`, { cache: "no-store" });
    const data = await res.json();

    nameRef.current.value = data.itemName;
    categoryRef.current.value = data.itemCategory;
    priceRef.current.value = data.itemPrice;
  }

  async function updateItem() {
    await fetch(`/api/item/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRef.current.value,
        category: categoryRef.current.value,
        price: priceRef.current.value,
      }),
    });

    router.push("/items");
  }

  useEffect(() => {
    loadItem();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Item</h2>

      <div>
        Name: <input ref={nameRef} />
      </div>

      <div>
        Category:
        <select ref={categoryRef}>
          <option>Stationary</option>
          <option>Kitchenware</option>
          <option>Appliance</option>
        </select>
      </div>

      <div>
        Price: <input ref={priceRef} />
      </div>

      <br />
      <button onClick={updateItem}>Update</button>
    </div>
  );
}
