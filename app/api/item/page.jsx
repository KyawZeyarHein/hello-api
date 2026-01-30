"use client";

import { useEffect, useRef, useState } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState([]);

  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();

  async function loadItems() {
    const res = await fetch("/api/item", { cache: "no-store" });
    const data = await res.json();
    setItems(data);
  }

  async function addItem() {
    await fetch("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameRef.current.value,
        category: categoryRef.current.value,
        price: priceRef.current.value,
      }),
    });

    nameRef.current.value = "";
    priceRef.current.value = "";

    loadItems();
  }

  async function deleteItem(id) {
    await fetch(`/api/item/${id}`, {
      method: "DELETE",
    });
    loadItems();
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Item CRUD</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemPrice}</td>
              <td>
                <button onClick={() => deleteItem(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Add row */}
          <tr>
            <td>
              <input ref={nameRef} />
            </td>
            <td>
              <select ref={categoryRef}>
                <option>Stationary</option>
                <option>Kitchenware</option>
                <option>Appliance</option>
              </select>
            </td>
            <td>
              <input ref={priceRef} />
            </td>
            <td>
              <button onClick={addItem}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
