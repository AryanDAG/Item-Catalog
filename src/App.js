import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddItem from "./pages/AddItem";
import ViewItems from "./pages/ViewItems";

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/add" className="hover:underline">Add Item</Link>
        <Link to="/view" className="hover:underline">View Items</Link>
      </nav>
      <Routes>
        <Route path="/add" element={<AddItem />} />
        <Route path="/view" element={<ViewItems />} />
      </Routes>
    </Router>
  );
}

export default App;