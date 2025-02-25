import React, { useState, useEffect } from "react";
import "../Styles/Transaction.css";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ category: "", amount: "" });
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch transactions from db.json
  useEffect(() => {
    fetch("http://localhost:3000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  // Add new transaction
  const handleAdd = (e) => {
    e.preventDefault();
    const newEntry = { category: newTransaction.category, amount: Number(newTransaction.amount) };

    fetch("http://localhost:3000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions([...transactions, data]);
        setNewTransaction({ category: "", amount: "" });
      });
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({ category: transaction.category, amount: transaction.amount.toString() });
  };

  // ✅ Fixed Update transaction
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTransaction) return;

    const updatedTransaction = {
      id: editingTransaction.id,
      category: newTransaction.category,
      amount: Number(newTransaction.amount),
    };

    fetch(`http://localhost:3000/transactions/${editingTransaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTransaction),
    })
      .then((res) => res.json())
      .then(() => {
        setTransactions(
          transactions.map((t) => (t.id === editingTransaction.id ? updatedTransaction : t))
        );
        setEditingTransaction(null);
        setNewTransaction({ category: "", amount: "" });
      });
  };

  // Delete transaction
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/transactions/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTransactions(transactions.filter((t) => t.id !== id));
    });
  };

  return (
    <div className="transaction-container">
      <h1>Transaction Management</h1>

      {/* Form for adding/updating transactions */}
      <form onSubmit={editingTransaction ? handleUpdate : handleAdd} className="transaction-form">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newTransaction.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingTransaction ? "Update" : "Add"} Transaction</button>
        {editingTransaction && (
          <button type="button" onClick={() => setEditingTransaction(null)}>
            Cancel
          </button>
        )}
      </form>

      {/* Transaction List */}
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-item">
            <span>{transaction.category} - ${transaction.amount}</span>
            <button onClick={() => handleEdit(transaction)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(transaction.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
