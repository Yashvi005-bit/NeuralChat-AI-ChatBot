import { useState, useCallback } from 'react';
import { MessageSquare, Plus, Trash2, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ sessions, activeId, onSelect, onNewChat, onDeleteSession, collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const [hoveredId, setHoveredId] = useState(null);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} aria-label="Chat sidebar">
      <div className="sidebar__header">
        {!collapsed && (
          <div className="sidebar__logo">
            <span className="sidebar__logo-dot" aria-hidden="true" />
            NeuralChat
          </div>
        )}
        <button
          className="sidebar__collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* New Chat */}
          <button
            className="sidebar__new-chat"
            onClick={onNewChat}
            id="sidebar-new-chat-btn"
            aria-label="Start a new chat"
          >
            <Plus size={15} />
            New Chat
          </button>

          {/* History */}
          <p className="sidebar__section-label">Recent</p>

          <div className="sidebar__history" role="list" aria-label="Chat history">
            {sessions.length === 0 ? (
              <div className="sidebar__empty-history">
                <MessageSquare size={28} />
                <p>No conversations yet.<br />Start a new chat above.</p>
              </div>
            ) : (
              sessions.map(session => (
                <div
                  key={session.id}
                  role="listitem"
                  className={`sidebar__history-item ${session.id === activeId ? 'sidebar__history-item--active' : ''}`}
                  onClick={() => onSelect(session.id)}
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-current={session.id === activeId ? 'true' : undefined}
                >
                  <span className="sidebar__history-icon">
                    <MessageSquare size={13} />
                  </span>
                  <span className="sidebar__history-title" title={session.title}>
                    {session.title}
                  </span>
                  {(hoveredId === session.id || session.id === activeId) && (
                    <button
                      className="sidebar__history-delete"
                      onClick={e => { e.stopPropagation(); onDeleteSession(session.id); }}
                      aria-label={`Delete chat: ${session.title}`}
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="sidebar__footer">
            <div className="sidebar__user" aria-label="User profile">
              <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
              <div className="sidebar__user-info">
                <p className="sidebar__user-name">{user?.name || 'User'}</p>
                <p className="sidebar__user-email">{user?.email || ''}</p>
              </div>
            </div>
            <button
              className="sidebar__logout"
              onClick={handleLogout}
              id="sidebar-logout-btn"
              aria-label="Log out"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
