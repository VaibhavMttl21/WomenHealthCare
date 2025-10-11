import React, { useState } from 'react';
import { OnlineUser } from '../../store/slices/broadcastSlice';
import { Users } from '../ui/Icons';

interface OnlineMembersProps {
  members: OnlineUser[];
  totalCount: number;
}

export const OnlineMembers: React.FC<OnlineMembersProps> = ({ members, totalCount }) => {
  const [showAll, setShowAll] = useState(false);
  const displayMembers = showAll ? members : members.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-maroon" />
          <h3 className="font-bold text-neutral-charcoal">Online Members</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-green-600">{totalCount}</span>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {displayMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-maroon to-accent-skyblue flex items-center justify-center text-white font-semibold">
                {member.userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-charcoal truncate">
                {member.userName}
              </p>
              {member.role && (
                <p className="text-xs text-gray-500 capitalize">{member.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {members.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-primary-maroon hover:bg-primary-maroon hover:text-white rounded-lg transition-colors font-medium"
        >
          {showAll ? 'Show Less' : `Show ${members.length - 10} More`}
        </button>
      )}
    </div>
  );
};
