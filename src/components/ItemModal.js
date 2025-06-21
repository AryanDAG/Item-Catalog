import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import emailjs from '@emailjs/browser';

function ItemModal({ item, onClose }) {
  const allImages = [item.coverImage, ...(Array.isArray(item.additionalImages) ? item.additionalImages : [])];

const sendEmail = () => {
  emailjs.send(
    'service_o0n2nc8',
    'template_9hsg54t',
    {
      name: item.name,
      description: item.description,
    },
    'qer-Yp5NODJjY7AEn'
  ).then(
    (result) => {
      alert("✅ Enquiry sent!");
    },
    (error) => {
      console.error("Email failed:", error);
      alert("❌ Failed to send enquiry.");
    }
  );
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
        <p className="text-sm text-gray-600 mb-1">
          <b>Type:</b> {item.type}
        </p>
        <p className="mb-4">{item.description}</p>

        {allImages.length > 0 ? (
          <div className="mb-4">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
            >
              {allImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`Item ${i}`}
                    className="w-full h-64 object-cover rounded"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="h-64 w-full bg-gray-100 flex items-center justify-center text-gray-500 border rounded mb-4">
            No images available
          </div>
        )}

        <button
          onClick={sendEmail}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Enquire
        </button>
      </div>
    </div>
  );
}

export default ItemModal;