import React, { useEffect, useState } from "react";
import ItemModal from "../components/ItemModal";

function ViewItems() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          "https://68565a841789e182b37dbeef.mockapi.io/items-api/items"
        );
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        console.log("✅ Fetched items:", data);
        setItems(data);
      } catch (err) {
        console.error("❌ Error fetching items:", err);
        setError("❌ Could not load items. Please try again later.");
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `https://68565a841789e182b37dbeef.mockapi.io/items-api/items/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete item");

      // Remove deleted item from local state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">View Items</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded shadow cursor-pointer hover:shadow-lg"
            onClick={() => handleItemClick(item)}
          >
            {item.coverImage ? (
              <img
                src={item.coverImage}
                alt={item.name}
                className="h-48 w-full object-cover rounded mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                }}
              />
            ) : (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-500 border rounded mb-2">
                No image
              </div>
            )}

            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.type}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-600 text-sm hover:underline mt-2"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>

    {showModal && selectedItem && (
      <ItemModal item={selectedItem} onClose={handleCloseModal} />
    )}
    </div>
  );
}

export default ViewItems;
