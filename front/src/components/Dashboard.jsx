import React from 'react';
import { Shield, Key, Database, RefreshCw, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Dashboard({ user, activeBookingsCount, devSettings, mockFlightsCount, onLogin, onLogout }) {
  const apiStatus = 'En ligne';
  const apiColor = 'var(--status-success)';
  
  const steps = [
    { num: '1', title: 'API REST Backend', desc: 'Serveur NestJS exposant les endpoints de vols et réservations.', status: 'configured' },
    { num: '2', title: 'SPA React (Ce Front)', desc: 'Interface web moderne de recherche et réservation de vols.', status: 'configured' },
    { num: '3', title: 'Délégation Discord / OAuth', desc: 'Récupération des informations de profil utilisateur via OAuth 2.0 Discord.', status: user && user.provider === 'Discord' ? 'configured' : 'todo' },
    { num: '4', title: 'Keycloak - Sécurité Backend', desc: 'Protection de l\'API REST avec validation du token JWT Keycloak.', status: 'configured' },
    { num: '5', title: 'Keycloak - Sécurité Frontend', desc: 'Authentification OIDC sur le client React et obtention du JWT.', status: user && user.provider === 'Keycloak OIDC' ? 'configured' : 'todo' },
    { num: '7-8', title: 'OpenAPI & Gravitee API Gateway', desc: 'Définition du contrat Swagger et routage sécurisé de l\'API.', status: 'todo' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      animation: 'fadeIn 0.4s ease-out',
      width: '100%'
    }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
            Portail de Réservation <span className="text-gradient-purple">AeroFlow</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Bienvenue dans le tableau de bord de votre TP. Cette Single Page Application est entièrement câblée pour 
            simuler et se connecter à vos futurs microservices REST et à votre serveur d'authentification Keycloak.
          </p>
        </div>
        
        {/* Glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 1
        }} />
      </div>

      {/* Quick Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* Stat 1: OIDC Authentication Status */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: user ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: user ? 'var(--status-success)' : 'var(--status-error)',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Statut Sécurité</p>
            <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>
              {user ? 'Authentifié' : 'Anonyme'}
            </h3>
          </div>
        </div>

        {/* Stat 2: REST API Mode */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: devSettings.apiMode === 'live' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)',
            color: apiColor,
            padding: '12px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Database size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Source REST API</p>
            <h3 style={{ fontSize: '1.2rem', marginTop: '2px', color: apiColor }}>
              {apiStatus}
            </h3>
          </div>
        </div>

        {/* Stat 3: Available Flights */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vols Disponibles</p>
            <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>
              {mockFlightsCount} vols
            </h3>
          </div>
        </div>

        {/* Stat 4: My Active Bookings */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(217, 70, 239, 0.1)',
            color: 'var(--secondary)',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Key size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Mes Réservations</p>
            <h3 style={{ fontSize: '1.2rem', marginTop: '2px' }}>
              {activeBookingsCount} active{activeBookingsCount > 1 ? 's' : ''}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Section layout: 2 Columns */}
      <div className="grid-cols-2">
        {/* Left Side: OIDC Session Details / Login */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-between">
            <h3 style={{ fontSize: '1.2rem' }}>Identité OIDC (Keycloak)</h3>
            <span className="badge badge-info">{user ? user.provider : 'Déconnecté'}</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500 }}>Identifiant (sub)</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>u-59df240-410a</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500 }}>Nom Complet</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600 }}>{user.name}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500 }}>Email</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>{user.email}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500 }}>Rôles Realm</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }}>user</span>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(217, 70, 239, 0.2)', color: 'var(--secondary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(217,70,239,0.3)' }}>flight-booker</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500 }}>Droits Ressource (API)</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(20,184,166,0.3)' }}>book-flights</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-success)' }} />
                <span>Le jeton OIDC est stocké et sera attaché comme <code>Authorization: Bearer</code>.</span>
              </div>

              <button className="btn btn-secondary" onClick={onLogout} style={{ width: '100%' }}>
                Se déconnecter (Simulation Keycloak)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', flex: 1, minHeight: '200px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Vous êtes en navigation publique. Certaines actions (réservations) nécessiteront une authentification OIDC à l'étape 5 du TP.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-primary" onClick={onLogin} style={{ width: '100%' }}>
                  Simuler la redirection de Connexion OIDC
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  En mode de simulation, cela va générer un jeton JWT valide que vous pouvez inspecter dans l'onglet Développeur.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Architecture & TP Checklist */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Suivi d'Intégration du TP</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {steps.map((step) => (
              <div key={step.num} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px',
                borderRadius: '8px',
                background: step.status === 'configured' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                border: step.status === 'configured' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid transparent'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step.status === 'configured' ? 'var(--status-success)' : step.status === 'mocked' ? 'var(--status-info)' : 'rgba(255, 255, 255, 0.1)',
                  color: step.status === 'configured' ? 'var(--bg-darker)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  {step.status === 'configured' ? '✓' : step.num}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{step.title}</h4>
                    <span style={{
                      fontSize: '0.65rem',
                      color: step.status === 'configured' ? 'var(--status-success)' : step.status === 'mocked' ? 'var(--status-info)' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {step.status === 'configured' ? 'PRÊT' : step.status === 'mocked' ? 'SIMULÉ' : 'À FAIRE'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alert Warning for TP instructions */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        borderRadius: '12px'
      }}>
        <AlertTriangle size={20} style={{ color: 'var(--status-warning)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--status-warning)', fontWeight: 600 }}>Note importante de développement</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Vous pouvez configurer l'URL de votre serveur REST local (ex: <code>http://localhost:8080/java-rest-server/api</code>) ou 
            activer la connexion Keycloak réelle directement dans l'onglet <strong>Console Dev & OIDC</strong>. Les appels d'API s'y adapteront automatiquement.
          </p>
        </div>
      </div>
    </div>
  );
}
