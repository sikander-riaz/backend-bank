const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "users",
});

// Login
const getUserByEmail = (request, response) => {
  const { email, password } = request.body;

  const query = "SELECT * FROM users WHERE email = $1";

  pool.query(query, [email], (error, results) => {
    if (error) {
      return response.status(500).json({ error: "Database error" });
    }

    if (results.rows.length === 0) {
      return response
        .status(404)
        .json({ error: "User not found or incorrect credentials" });
    }

    const user = results.rows[0];

    const isValid = bcrypt.compareSync(password, user.password); //
    if (!isValid) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    response.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        acc_number: user.acc_number,
      },
    });
  });
};

// Signup
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const createUser = (request, response) => {
  const { name, email, password, phone_number } = request.body;
  const accountNumber = generateAccountNumber();
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const queryText = `
    INSERT INTO users (name, email, password, phone_number, acc_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, password, email, phone_number, acc_number
  `;

  const queryValues = [
    name,
    email,
    hashedPassword,
    phone_number,
    accountNumber,
  ];

  pool.query(queryText, queryValues, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }

    const newUser = results.rows[0];
    console.log("Request body:", request.body);

    response.status(201).json({
      message: `User added with ID: ${newUser.id}`,
      user: newUser,
    });
  });
};
const getAllUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return response.status(500).json({ error: "Internal Server Error" });
    }

    response.status(200).json(results.rows);
  });
};

module.exports = {
  getUserByEmail,
  createUser,
  getAllUsers,
};
