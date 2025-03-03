import React from "react";

const UserChatWindow = ({ userId }) => {
  const handleOpenChat = () => {
    if (userId === 11) {
      window.open("http://localhost:5173/chat", "_blank");
    } else {
      window.open("http://localhost:5173/login", "_blank");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleOpenChat} // Passing the function reference
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <i className="fas fa-comments text-2xl"></i>
      </button>
    </div>
  );
};

export default UserChatWindow;
