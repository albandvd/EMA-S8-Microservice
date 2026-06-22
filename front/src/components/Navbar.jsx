import React from 'react';
import { Plane, LayoutDashboard, Search, Briefcase, Terminal, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogin, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'flights', label: 'Recherche de Vols', icon: Search },
    { id: 'bookings', label: 'Mes Réservations', icon: Briefcase },
    { id: 'devconsole', label: 'Console Dev & OIDC', icon: Terminal },
  ];

  return (
    <nav className="glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 40px)',
      position: 'sticky',
      top: '20px',
      margin: '20px 0 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      gap: '32px',
      zIndex: 10
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: 'var(--glow-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Plane size={24} style={{ color: 'white', transform: 'rotate(-45deg)' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Aero<span className="text-gradient-purple">Flow</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            S8 Microservices
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                paddingLeft: isActive ? '13px' : '16px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Authentication Footer Card */}
      <div className="glass-panel" style={{
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} 
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white'
                }}>
                  {user.given_name?.[0] || user.name?.[0] || 'U'}
                </div>
              )}
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="badge badge-success" style={{ justifyContent: 'center', fontSize: '0.65rem', padding: '3px 8px' }}>
              OIDC Connecté
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={onLogout}
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', gap: '6px' }}
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <User size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Anonyme</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Non authentifié</p>
              </div>
            </div>

            <div className="badge badge-danger" style={{ justifyContent: 'center', fontSize: '0.65rem', padding: '3px 8px' }}>
              Mode Public
            </div>

            <button 
              className="btn btn-primary" 
              onClick={onLogin}
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', gap: '6px' }}
            >
              <LogIn size={14} /> Connexion OIDC (Simulé)
            </button>

            <a 
              className="btn btn-accent" 
              href="http://localhost:3000/auth/discord/login"
              style={{ 
                padding: '8px 12px', 
                fontSize: '0.85rem', 
                width: '100%', 
                gap: '6px', 
                textDecoration: 'none', 
                color: 'var(--text-dark)' 
              }}
            >
              <LogIn size={14} /> Connexion Discord
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
