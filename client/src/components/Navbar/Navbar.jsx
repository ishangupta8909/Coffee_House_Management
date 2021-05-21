import React, { useRef } from "react";
import cookie from "react-cookies";

export default function Navbar() {
  const customer = useRef(cookie.load("coffee-customer"));
  const employee = useRef(cookie.load("coffee-employee"));

  const logout = () => {
    if (cookie.load("coffee-employee"))
      cookie.save("coffee-employee", "false", { path: "/" });
    if (cookie.load("coffee-customer"))
      cookie.save("coffee-customer", "false", { path: "/" });
    window.location.href = "/";
  };

  const isLoggedIn = () => {
    const customerLoggedIn =
      customer.current !== "false" && customer.current !== undefined;
    const employeeLoggedIn =
      employee.current !== "false" && employee.current !== undefined;
    return customerLoggedIn || employeeLoggedIn;
  };

  return (
    <div class="nav">
      <ul>
        <li className="logo">CoffeeShop</li>
        <div>
          {isLoggedIn() && (
            <li className="logout">
              <a onClick={logout}>Logout</a>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
}
