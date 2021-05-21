import React, { useState } from "react";

export default function AddMenuItem(props) {
  const [coffee, setCoffee] = useState("");
  const [price, setPrice] = useState("");

  const add = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/menu/add`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        COFFEE: coffee,
        PRICE: Number(price),
      }),
    });
    const body = await response.json();
    props.remove();
    props.refresh();
  };

  return (
    <div className="add-menu-item">
      <input
        type="text"
        placeholder="Coffee"
        value={coffee}
        onChange={(e) => setCoffee(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={add}>Add</button>
    </div>
  );
}
