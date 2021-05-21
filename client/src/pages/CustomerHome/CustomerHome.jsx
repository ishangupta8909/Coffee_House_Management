import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import cookie from "react-cookies";

export default function CustomerHome() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const customer_id = cookie.load("coffee-customer");
    if (customer_id === undefined || customer_id === "false") {
      console.log("REDIRECTED");
      //window.location.href = "/";
      return;
    }
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/menu`);
    const body = await response.json();
    console.log(body);
    setMenu(body.map((item) => ({ ...item, QUANTITY: 0 })));
  };

  const fetchOrders = async () => {
    const CUSTOMER_ID = cookie.load("coffee-customer");
    setOrders([]);
    const response = await fetch(`${process.env.REACT_APP_URL}/api/order`);
    const body = await response.json();
    console.log(body);
    setOrders([...body.filter((item) => item.customer_id === CUSTOMER_ID)]);
  };

  const submitOrder = async () => {
    const CUSTOMER_ID = cookie.load("coffee-customer");
    const ORDER = menu
      .filter((item) => item.QUANTITY > 0)
      .map(({ COFFEE, PRICE, ...rest }) => rest);

    if (ORDER.length < 1) {
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/order/create`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          CUSTOMER_ID,
          ORDER,
        }),
      }
    );

    const body = await response.json();
    console.log(body);
    await fetchOrders();
    await fetchMenu();
  };

  const cancelOrder = async (ORDER_ID) => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/order/cancel`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ORDER_ID,
        }),
      }
    );

    await fetchOrders();
  };

  const incrementQuantity = async (coffee_id) => {
    //console.log("Called");
    setMenu((prev) => {
      const new_menu = [];
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].COFFEE_ID === coffee_id)
          new_menu.push({ ...prev[i], QUANTITY: prev[i].QUANTITY + 1 });
        else new_menu.push({ ...prev[i] });
      }
      return [...new_menu];
    });
  };

  const decrementQuantity = async (coffee_id) => {
    //console.log("Called");
    setMenu((prev) => {
      const new_menu = [];
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].COFFEE_ID === coffee_id)
          new_menu.push({ ...prev[i], QUANTITY: prev[i].QUANTITY - 1 });
        else new_menu.push({ ...prev[i] });
      }
      return [...new_menu];
    });
  };

  return (
    <div>
      <Navbar />
      <div className="background-image"></div>
      <div className="page-container">
        <div className="menu">
          <h1>Menu</h1>
          <table>
            <tr>
              <th>S. no</th>
              <th>Coffee</th>
              <th>Price</th>
              <th></th>
            </tr>
            {menu.map((item, index) => (
              <tr key={item.COFFEE_ID}>
                <td>{index + 1}</td>
                <td>{item.COFFEE}</td>
                <td>${item.PRICE}</td>
                <td>
                  {item.QUANTITY == 0 ? (
                    <button onClick={() => incrementQuantity(item.COFFEE_ID)}>
                      Add to cart
                    </button>
                  ) : (
                    "Added"
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
        <div className="menu">
          <h1>Cart</h1>
          <table>
            <tr>
              <th>S. no</th>
              <th>Coffee</th>
              <th>Price</th>
              <th>Quantity</th>

              <th>Amount</th>
            </tr>
            {menu
              .filter((item) => item.QUANTITY > 0)
              .map((item, index) => (
                <tr key={item.COFFEE_ID}>
                  <td>{index + 1}</td>
                  <td>{item.COFFEE}</td>
                  <td>${item.PRICE}</td>
                  <td>
                    <button onClick={() => decrementQuantity(item.COFFEE_ID)}>
                      -
                    </button>
                    {item.QUANTITY}
                    <button onClick={() => incrementQuantity(item.COFFEE_ID)}>
                      +
                    </button>
                  </td>

                  <td>${item.QUANTITY * item.PRICE}</td>
                </tr>
              ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Total:</td>
              <td>
                $
                {menu.reduce(
                  (acc, item) => acc + item.QUANTITY * item.PRICE,
                  0
                )}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <button onClick={submitOrder}>Submit</button>
              </td>
            </tr>
          </table>
        </div>
        <div className="orders">
          <h1>Orders</h1>
          <table>
            <tr>
              <th>S. No</th>
              <th>Items</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
            {orders.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <table>
                    <tr>
                      <th>Coffee</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                    {item.details.map((order_item) => (
                      <tr>
                        <td>{order_item.COFFEE}</td>
                        <td>${order_item.PRICE}</td>
                        <td>{order_item.quantity}</td>
                      </tr>
                    ))}
                  </table>
                </td>
                <td>${item.amount.toFixed(2)}</td>
                <td>{new Date(item.time_stamp).toLocaleString()}</td>
                <td>{item.status == 0 ? "Getting ready..." : "Ready!"}</td>
                <td>
                  {item.status == 0 && (
                    <button onClick={() => cancelOrder(item.order_id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
