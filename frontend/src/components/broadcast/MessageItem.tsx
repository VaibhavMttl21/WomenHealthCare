import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BroadcastMessage } from '../../store/slices/broadcastSlice';
import { Pencil, Trash2, Check, X } from '../ui/Icons';

interface MessageItemProps {
  message: BroadcastMessage;
  isOwnMessage: boolean;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent]);

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
        isOwnMessage ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-maroon to-accent-skyblue flex items-center justify-center text-white font-semibold">
          {message.userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isOwnMessage ? 'items-end' : ''}`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`font-semibold text-neutral-charcoal ${isOwnMessage ? 'order-2' : ''}`}>
            {message.userName}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          {message.edited && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              ref={editInputRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-primary-maroon rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-maroon resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-primary-maroon text-white rounded-lg hover:bg-opacity-90 flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-neutral-charcoal whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {message.imageUrl && (
              <div className="mt-2">
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-sm rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.imageUrl, '_blank')}
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isOwnMessage && showActions && !isEditing && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-primary-maroon transition-colors"
              title="Edit message"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(message.id)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
