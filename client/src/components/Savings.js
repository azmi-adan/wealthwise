
import React, { useState, useEffect } from "react";
import "../Styles/Savings.css";

const Savings = () => {
  const [savingsList, setSavingsList] = useState([]);
  const [newSavings, setNewSavings] = useState({ current: "", goal: "" });
  const [editingSavings, setEditingSavings] = useState(null);

  // Fetch savings data
  useEffect(() => {
    fetch("http://localhost:3000/savings")
      .then((res) => res.json())
      .then((data) => setSavingsList(data))
      .catch((error) => console.error("Error fetching savings:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewSavings({ ...newSavings, [e.target.name]: e.target.value });
  };

  // Add new savings entry
  const handleAdd = (e) => {
    e.preventDefault();
    const newEntry = { ...newSavings, id: savingsList.length + 1, current: Number(newSavings.current), goal: Number(newSavings.goal) };

    fetch("http://localhost:3000/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
      .then((res) => res.json())
      .then((data) => {
        setSavingsList([...savingsList, data]);
        setNewSavings({ current: "", goal: "" });
      });
  };

  // Edit savings entry
  const handleEdit = (savings) => {
    setEditingSavings(savings);
    setNewSavings({ current: savings.current, goal: savings.goal });
  };

  // Update savings entry
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/savings/${editingSavings.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editingSavings, current: Number(newSavings.current), goal: Number(newSavings.goal) }),
    })
      .then((res) => res.json())
      .then(() => {
        setSavingsList(
          savingsList.map((s) =>
            s.id === editingSavings.id ? { ...editingSavings, current: Number(newSavings.current), goal: Number(newSavings.goal) } : s
          )
        );
        setEditingSavings(null);
        setNewSavings({ current: "", goal: "" });
      });
  };

  // Delete savings entry
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/savings/${id}`, {
      method: "DELETE",
    }).then(() => {
      setSavingsList(savingsList.filter((s) => s.id !== id));
    });
  };

  return (
    <div className="savings-container">
      <h1>Savings Management</h1>

      {/* Form for adding/updating savings */}
      <form onSubmit={editingSavings ? handleUpdate : handleAdd} className="savings-form">
        <input
          type="number"
          name="current"
          placeholder="Current Savings"
          value={newSavings.current}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="goal"
          placeholder="Savings Goal"
          value={newSavings.goal}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingSavings ? "Update" : "Add"} Savings</button>
        {editingSavings && <button onClick={() => setEditingSavings(null)}>Cancel</button>}
      </form>

      {/* Savings List */}
      <ul className="savings-list">
        {savingsList.map((savings) => (
          <li key={savings.id} className="savings-item">
            <span>Current: ${savings.current} | Goal: ${savings.goal}</span>
            <button onClick={() => handleEdit(savings)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(savings.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Savings;
