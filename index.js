// app.listen(PORT,HOST);
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const cors = require("cors");
const sqlScripts = require("./scripts");
// Create connection

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

// Connect
db.connect((err) => {
  if (err) {
    console.error(err.message, err.stack);
    return;
  }
  console.log("MySql Connected...");
  db.query("SHOW DATABASES LIKE 'menucoffee';", (err, result) => {
    if (result.length > 0) {
      db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "menucoffee",
      });
    } else {
      console.log("Setting up");
      sqlScripts.map((script) => db.query(script));
      db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "menucoffee",
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/login/employee", (req, res) => {
  const query = `SELECT employee_id,password FROM employee where username='${req.body.username}'`;
  console.log(db.config);
  db.query(query, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      if (result[0].password === req.body.password) {
        res.send(result[0].employee_id);
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  });
});

app.post("/api/login/customer", (req, res) => {
  const query = `SELECT customer_id,password FROM customers where username='${req.body.username}'`;
  db.query(query, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      if (result[0].password === req.body.password) {
        res.send(result[0].customer_id);
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  });
});

app.get("/api/menu", (req, res) => {
  db.query("SELECT * from MENU", (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

//ADDING MENU ITEM
app.post("/api/menu/add", (req, res) => {
  const COFFEE_ID = uuid.v4();
  const COFFEE = req.body.COFFEE;
  const PRICE = req.body.PRICE;

  let sql = `INSERT INTO MENU (COFFEE_ID,COFFEE,PRICE) VALUES ('${COFFEE_ID}','${COFFEE}','${PRICE}')`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send("500 INTERNAL SERVER ERROR");
      console.log(req.body);
    } else {
      res.send("200");
    }
  });
});

// Delete post
app.post("/api/menu/delete", (req, res) => {
  let sql = `DELETE FROM MENU where COFFEE_ID='${req.body.COFFEE_ID}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      res.send("ERROR");
      console.log(err);
      console.log(req.body);
    } else {
      res.send("200");
    }
  });
});

app.post("/api/menu/update", (req, res) => {
  let sql = `UPDATE MENU SET COFFEE = '${req.body.COFFEE}', PRICE = '${req.body.PRICE}' WHERE COFFEE_ID ='${req.body.COFFEE_ID}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      res.send("ERROR");
      console.log(err);
      console.log(req.body);
    } else {
      res.send("200");
    }
  });
});

app.post("/api/order/complete", (req, res) => {
  let sql = `UPDATE STATUS SET STATUS='1' WHERE ORDER_ID= '${req.body.ORDER_ID}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      res.send("ERROR");
      console.log(err);
      console.log(req.body);
    } else {
      res.send("200");
    }
  });
});

app.get("/api/order", (req, res) => {
  db.query(
    "select *, (orders.quantity * menu.price) as amount from orders natural join menu natural join customers natural join status;",
    (err, result) => {
      if (err) throw err;
      //console.log(result);
      const order_dict = {};
      const orders = [];
      for (let i = 0; i < result.length; i++) {
        //console.log(orders, order_dict);
        if (order_dict[result[i].order_id] === undefined) {
          //doesnt exist in array
          const {
            coffee_id,
            quantity,
            COFFEE,
            PRICE,
            password,
            amount,
            ...new_order
          } = result[i];
          new_order.amount = amount;
          new_order.details = [
            {
              coffee_id,
              quantity,
              COFFEE,
              PRICE,
            },
          ];
          orders.push(new_order);
          order_dict[result[i].order_id] = orders.length - 1;
        } else {
          //exists in array
          let index = order_dict[result[i].order_id];
          console.log(index);
          const {
            coffee_id,
            quantity,
            COFFEE,
            PRICE,
            password,
            amount,
            ...rest
          } = result[i];
          orders[index].amount += amount;
          orders[index].details.push({
            coffee_id,
            quantity,
            COFFEE,
            PRICE,
          });
        }
      }
      orders.sort((a, b) => a.timestamp - b.timestamp);
      res.send(orders);
    }
  );
});

app.post("/api/order/create", (req, res) => {
  console.log(req.body);
  const ORDER_ID = uuid.v4();
  const TIME_STAMP = new Date().getTime();
  let sql = `INSERT INTO STATUS (ORDER_ID,STATUS) VALUES ('${ORDER_ID}',0)`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let count = 0;
      let flag = true;
      for (let i = 0; i < req.body.ORDER.length; i++) {
        let sql = `INSERT INTO ORDERS (CUSTOMER_ID,ORDER_ID,TIME_STAMP,COFFEE_ID,QUANTITY) VALUES ('${req.body.CUSTOMER_ID}','${ORDER_ID}','${TIME_STAMP}','${req.body.ORDER[i].COFFEE_ID}','${req.body.ORDER[i].QUANTITY}')`;
        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            if (flag) {
              res.send("ERROR");
              flag = false;
            }
          }
          count++;
          if (count == req.body.ORDER.length && flag) {
            res.send("200");
          }
        });
      }
    }
  });
});

app.post("/api/order/cancel", (req, res) => {
  let sql = `DELETE FROM STATUS where ORDER_ID = '${req.body.ORDER_ID}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      res.send("ERROR");
      console.log(err);
      console.log(req.body);
    } else {
      res.send(200);
    }
  });
});

app.listen("8080", () => {
  console.log("Server started on port 8080");
});
