import express from "express";
import mysql from "mysql2";
import { faker } from "@faker-js/faker";

const app = express();

const db = mysql.createPool({
  host: "db",
  user: "app",
  password: "app",
  database: "app",
  port: 3306,
  connectionLimit: 10,
});

async function executeQueryAsync(query, parameters) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      connection.query(query, parameters, (queryError, result) => {
        connection.release(); // release the connection after the query
        if (queryError) {
          return reject(queryError);
        } else {
          return resolve(result);
        }
      });
    });
  });
}

const sqlInsert = "INSERT INTO people (name) VALUES (?)";
const sqlSelect = "SELECT name FROM people";

function generateListName(list) {
  const listName = list.map((item) => {
    return `<li>${item.name}</li>`;
  });

  return listName.join("");
}

function generateHtml(list = []) {
  return `
    <h1>Full Cycle Rocks!</h1>
    <ul>
      ${generateListName(list)}
    </ul>
  `;
}

app.get("/", async (req, res) => {
  try {
    const name = faker.person.firstName();
    await executeQueryAsync(sqlInsert, [name]);
    const list = await executeQueryAsync(sqlSelect, []);
    res.send(generateHtml(list));
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      res.send("Database connection error");
    } else {
      res.send("An error occurred");
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
