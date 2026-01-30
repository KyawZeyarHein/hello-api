"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PAGE_SIZE = 5;

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();

  async function loadItems() {
    const res = await fetch(`/api/item?page=${page}&limit=${PAGE_SIZE}`, {
      cache: "no-store",
    });
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
    await fetch(`/api/item/${id}`, { method: "DELETE" });
    loadItems();
  }

  useEffect(() => {
    loadItems();
  }, [page]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Item CRUD</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th colSpan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemPrice}</td>
              <td>
                <Link href={`/items/${item._id}`}>Edit</Link>
              </td>
              <td>
                <button onClick={() => deleteItem(item._id)}>Delete</button>
              </td>
            </tr>
          ))}

          {/* Add new item */}
          <tr>
            <td><input ref={nameRef} /></td>
            <td>
              <select ref={categoryRef}>
                <option>Stationary</option>
                <option>Kitchenware</option>
                <option>Appliance</option>
              </select>
            </td>
            <td><input ref={priceRef} /></td>
            <td colSpan="2">
              <button onClick={addItem}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>

      <br />

      {/* Pagination */}
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>
      <span style={{ margin: "0 10px" }}>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
