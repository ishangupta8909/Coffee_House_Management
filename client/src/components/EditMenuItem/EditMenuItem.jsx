import React, { useState } from "react";

export default function EditMenuItem({ coffeeDetails, remove, refresh }) {
  const [coffee, setCoffee] = useState(coffeeDetails.COFFEE);
  const [price, setPrice] = useState(coffeeDetails.PRICE);

  const update = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/menu/update`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          COFFEE_ID: coffeeDetails.COFFEE_ID,
          COFFEE: coffee,
          PRICE: Number(price),
        }),
      }
    );
    remove();
    refresh();
  };

  return (
    <div className="edit-menu-item">
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
      <button onClick={update}>Update</button>
    </div>
  );
}
