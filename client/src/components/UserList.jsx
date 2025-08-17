import { useEffect, useState } from "react";

export default function UserList({ users, userActivity }) {
  const [isLoading, setIsLoading] = useState(!users);

  useEffect(() => {
    if (users) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [users]);

  const getUserAvatar = (username) => {
    const colors = [
      "bg-primary", "bg-secondary", "bg-accent", "bg-info", 
      "bg-success", "bg-warning", "bg-error", "bg-neutral"
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return "earlier today";
  };

  // Combine active users and recently left users
  const getAllUsersWithStatus = () => {
    const allUsers = new Map();
    
    // Add active users
    users.forEach(user => {
      allUsers.set(user.userId, {
        ...user,
        status: 'active'
      });
    });
    
    // Add users who left (from userActivity)
    if (userActivity) {
      userActivity.forEach((activity, userId) => {
        if (activity.status === 'left' && !allUsers.has(userId)) {
          // Only show users who left in the last 24 hours
          const timeSinceLeft = Date.now() - activity.leftAt;
          if (timeSinceLeft < 24 * 60 * 60 * 1000) {
            allUsers.set(userId, {
              userId,
              username: activity.username,
              status: 'left',
              leftAt: activity.leftAt
            });
          }
        }
      });
    }
    
    return Array.from(allUsers.values());
  };

  const allUsersWithStatus = getAllUsersWithStatus();
  const activeUsersCount = users.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <span className="loading loading-spinner loading-sm text-primary mb-2"></span>
        <span className="text-xs text-base-content/50">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Collaborators</span>
          <div className="badge badge-primary badge-sm">
            {activeUsersCount} active
          </div>
        </div>
        {activeUsersCount > 0 && (
          <div className="text-xs text-base-content/50">
            🟢 Online
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {allUsersWithStatus.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="text-2xl mb-2 opacity-50">👥</div>
            <p className="text-sm text-base-content/60 font-medium">No users online</p>
            <p className="text-xs text-base-content/40 mt-1">
              Share the room link to collaborate
            </p>
          </div>
        ) : (
          allUsersWithStatus.map((user) => (
            <div
              key={String(user.userId)}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                user.status === 'active' 
                  ? 'bg-base-200/50 hover:bg-base-200' 
                  : 'bg-error/10 border border-error/20'
              }`}
            >
              <div className="avatar placeholder">
                <div className={`${getUserAvatar(user.username)} text-neutral-content rounded-full w-8 h-8 ${
                  user.status === 'left' ? 'opacity-60' : ''
                }`}>
                  <span className="text-xs font-medium">
                    {getInitials(user.username)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium truncate ${
                    user.status === 'left' ? 'line-through opacity-60' : ''
                  }`}>
                    {user.username}
                  </span>
                  <span className="text-xs">
                    {user.status === 'active' ? '🟢' : '🔴'}
                  </span>
                </div>
                <div className="text-xs text-base-content/50">
                  {user.status === 'active' ? (
                    <>User ID: {String(user.userId).slice(0, 8)}...</>
                  ) : (
                    <span className="text-error">
                      Left {formatTimeAgo(user.leftAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${
                  user.status === 'active' 
                    ? 'bg-success animate-pulse' 
                    : 'bg-error opacity-60'
                }`}></div>
              </div>
            </div>
          ))
        )}
      </div>

      {allUsersWithStatus.length > 0 && (
        <div className="pt-2 border-t border-base-300">
          <div className="text-xs text-base-content/40 text-center">
            {activeUsersCount > 0 
              ? "Real-time collaboration active" 
              : "No active collaborators"
            }
          </div>
        </div>
      )}
    </div>
  );
}