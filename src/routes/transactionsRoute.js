import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO transactions (user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;
    console.log("Transaction created successfully", transaction[0]);
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction[0],
    });
  } catch (error) {
    console.log("Error creating transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC
    `;
    console.log("Transactions fetched successfully", transactions);
    res.status(200).json({ transactions });
  } catch (error) {
    console.log("Error getting transactions", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (transaction.length === 0) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    } else {
      console.log("Transaction deleted successfully", transaction[0]);
      res.status(200).json({
        message: "Transaction deleted successfully",
        transaction: transaction[0],
      });
    }
  } catch (error) {
    console.log("Error deleting transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/summary/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const balance = await sql`
    SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id}
    `;

    const income = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${user_id} AND amount > 0
    `;

    const expenses = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${user_id} AND amount < 0
    `;

    const summary = {
      balance: balance[0].balance,
      income: income[0].income,
      expenses: expenses[0].expenses,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.log("Error getting transaction summary", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
