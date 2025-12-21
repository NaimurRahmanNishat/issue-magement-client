/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSendMessageMutation } from "@/redux/features/emergency/emergencyApi";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const EmergencyMessage = () => {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [category, setCategory] = useState("water");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning("Please enter a message!");
      return;
    }

    if (message.trim().length < 2) {
      toast.warning("Message must be at least 2 characters!");
      return;
    }

    try {
      const response = await sendMessage({ category, message }).unwrap();
      
      toast.success(
        response.message || "Emergency message sent successfully!"
      );
      
      // Reset form
      setMessage("");
      setCategory("water");
    } catch (error: any) {
      console.error("Error sending emergency message:", error);
      toast.error(
        error?.data?.message || "Failed to send emergency message!"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-6">
          🚨 Send Emergency Message
        </h2>

        {/* Category Select */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Select Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="water">💧 Water</SelectItem>
              <SelectItem value="gas">🔥 Gas</SelectItem>
              <SelectItem value="electricity">⚡ Electricity</SelectItem>
              <SelectItem value="broken-road">🛣️ Broken Road</SelectItem>
              <SelectItem value="politics">🏛️ Politics</SelectItem>
              <SelectItem value="other">❗ Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message Textarea */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the emergency in detail..."
            rows={5}
            maxLength={500}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {message.length}/500 characters
          </p>
        </div>

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md transition ${
            isLoading || !message.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Sending..." : "🚨 Send Emergency"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmergencyMessage;