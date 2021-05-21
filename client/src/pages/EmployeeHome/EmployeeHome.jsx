import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import AddMenuItem from "../../components/AddMenuItem/AddMenuItem";
import EditMenuItem from "../../components/EditMenuItem/EditMenuItem";
import Navbar from "../../components/Navbar/Navbar";

export default function EmployeeHome() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editCoffee, setEditCoffee] = useState(false);

  useEffect(() => {
    const employee_id = cookie.load("coffee-employee");
    console.log(employee_id);
    if (employee_id === undefined || employee_id === "false") {
      window.location.href = "/";
    }
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/menu`);
    const body = await response.json();
    console.log(body);
    setMenu(body);
  };

  const deleteMenuItem = async (coffee_id) => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/menu/delete`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          COFFEE_ID: coffee_id,
        }),
      }
    );
    fetchMenu();
    fetchOrders();
  };

  const fetchOrders = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/order`);
    const body = await response.json();
    console.log(body);
    setOrders(body.filter((item) => item.status == 0));
  };

  const completeOrder = async (order_id) => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/order/complete`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ORDER_ID: order_id,
        }),
      }
    );
    const body = await response.json();
    console.log(body);
    await fetchOrders();
  };

  return (
    <div>
      <Navbar />
      <div className="background-image"></div>
      <div className="page-container">
        <div className="menu">
          <h1>Menu</h1>
          <button onClick={() => setShowAddMenu((prev) => !prev)}>
            Add Menu Item
          </button>
          {showAddMenu && (
            <AddMenuItem
              remove={() => setShowAddMenu(false)}
              refresh={fetchMenu}
            />
          )}
          {editCoffee && (
            <EditMenuItem
              coffeeDetails={editCoffee}
              remove={() => setEditCoffee(false)}
              refresh={fetchMenu}
            />
          )}

          <table>
            <tr>
              <th>S. no</th>
              <th>Coffee</th>
              <th>Price</th>
              <th></th>
            </tr>
            {menu.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item.COFFEE}</td>
                <td>${item.PRICE}</td>
                <td>
                  <button onClick={() => deleteMenuItem(item.COFFEE_ID)}>
                    Delete
                  </button>
                  <button onClick={() => setEditCoffee(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </table>
        </div>
        <div className="orders">
          <h1>Open Orders</h1>
          <table>
            <tr>
              <th>S. No</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th>Time</th>
              <th>Amount</th>
              <th></th>
            </tr>
            {orders.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item.name}</td>
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
                        <td>{order_item.PRICE}</td>
                        <td>{order_item.quantity}</td>
                      </tr>
                    ))}
                  </table>
                </td>
                <td>{new Date(item.time_stamp).toLocaleString()}</td>
                <td>{item.amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => completeOrder(item.order_id)}>
                    Completed!
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
