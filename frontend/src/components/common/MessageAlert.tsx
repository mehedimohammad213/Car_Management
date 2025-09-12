import React from "react";

interface MessageAlertProps {
  message: {
    type: "success" | "error";
    text: string;
  } | null;
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-xl shadow-lg ${
        message.type === "success"
          ? "bg-green-100 border-l-4 border-green-500 text-green-700"
          : message.type === "error"
          ? "bg-red-100 border-l-4 border-red-500 text-red-700"
          : "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
      }`}
    >
      {message.text}
    </div>
  );
};

export default MessageAlert;
