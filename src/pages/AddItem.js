import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function AddItem() {
  const [item, setItem] = useState({
    name: "",
    type: "",
    description: "",
    coverImage: "",
    additionalImages: [],
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const compressOptions = {
     maxSizeMB: 0.05,
     maxWidthOrHeight: 600,
     useWebWorker: true,
  };

  const handleCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await imageCompression(file, compressOptions);
      const base64 = await imageCompression.getDataUrlFromFile(compressed);
      setItem((prev) => ({ ...prev, coverImage: base64 }));
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const handleAdditionalImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Limit to 3
    try {
      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const compressed = await imageCompression(file, compressOptions);
          return await imageCompression.getDataUrlFromFile(compressed);
        })
      );
      setItem((prev) => ({
        ...prev,
        additionalImages: compressedImages,
      }));
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
  ...item,
  additionalImages: item.additionalImages.slice(0, 2), // only 1 additional image
};

    // Optional: check size before posting
    const payloadSize = JSON.stringify(payload).length / 1024;
    console.log(`📦 Payload size: ${payloadSize.toFixed(2)} KB`);

    const payloadSizeKB = JSON.stringify(payload).length / 1024;

if (payloadSizeKB > 150) {
  setMessage("❌ Upload failed: Images too large. Please choose smaller images.");
  return;
}

    try {
      const response = await fetch("https://68565a841789e182b37dbeef.mockapi.io/items-api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API Error");

      setMessage("✅ Item successfully added!");
      setItem({
        name: "",
        type: "",
        description: "",
        coverImage: "",
        additionalImages: [],
      });
    } catch (error) {
      console.error("Error posting to API:", error);
      setMessage("❌ Error adding item. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />

        <select
          className="w-full p-2 border rounded"
          name="type"
          value={item.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option>Shirt</option>
          <option>Pant</option>
          <option>Shoes</option>
          <option>Sports Gear</option>
        </select>

        <textarea
          className="w-full p-2 border rounded"
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Item Description"
          required
        />

        <label className="block font-semibold">Cover Image</label>
        <input
          className="w-full p-2 border rounded"
          type="file"
          accept="image/*"
          onChange={handleCoverImage}
          required
        />

        <label className="block font-semibold">Additional Images (max 3)</label>
        <input
          className="w-full p-2 border rounded"
          type="file"
          accept="image/*"
          multiple
          onChange={handleAdditionalImages}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </div>
  );
}

export default AddItem;