import React, { useState, useRef } from 'react';
import { Send, Smile, Image } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onImageUpload: (file: File) => Promise<string | null>;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onImageUpload,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Typing indicator
    onTypingStart();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onTypingStop();
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        const caption = message.trim() || 'Image';
        onSendMessage(caption, imageUrl);
        setMessage('');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 left-0 z-10">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              showPreview: false
            }}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-md p-3 flex items-end gap-2">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-primary-maroon hover:bg-gray-100 rounded-lg transition-colors"
          disabled={disabled || isUploading}
          type="button"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-primary-maroon hover:bg-gray-100 rounded-lg transition-colors"
          disabled={disabled || isUploading}
          type="button"
          title="Upload image"
        >
          <Image className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isUploading ? 'Uploading image...' : 'Type your message...'}
          disabled={disabled || isUploading}
          className="flex-1 resize-none bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-maroon max-h-32 overflow-y-auto"
          rows={1}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isUploading}
          className="flex-shrink-0 p-2 bg-primary-maroon text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          type="button"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};