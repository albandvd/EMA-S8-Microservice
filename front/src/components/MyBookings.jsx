import React from 'react';
import { Plane, Calendar, CreditCard, Armchair, Shield, Trash2, ExternalLink } from 'lucide-react';

export default function MyBookings({ bookings, onCancelBooking, user }) {
  
  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('fr-FR', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      animation: 'fadeIn 0.3s ease-out',
      width: '100%'
    }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Mes Réservations</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Consultez et gérez vos vols réservés.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => {
            const bookingRef = `AERO-${booking.id}-${booking.place}`;
            return (
              <div 
                key={booking.id} 
                className="glass-panel"
                style={{
                  padding: '20px 24px',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1fr 150px',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(22, 28, 45, 0.45)',
                  borderLeft: '4px solid var(--primary)'
                }}
              >
                {/* Flight Main info */}
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Réf : {bookingRef}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Vol {booking.vol}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({booking.compagnie})</span>
                  </div>
                </div>

                {/* Seat and Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Heure</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Siège attribué</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Armchair size={14} style={{ color: 'var(--accent)' }} />
                    <span>{booking.place}</span>
                  </div>
                </div>

                {/* Price and Auth status */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prix payé & Statut</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {booking.prix} €
                    </span>
                    <span 
                      className={`badge ${booking.authMode === 'Bearer' ? 'badge-success' : 'badge-warning'}`} 
                      style={{ fontSize: '0.6rem', padding: '2px 6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                      title={booking.authMode === 'Bearer' ? 'Réservé avec signature de jeton JWT' : 'Réservé sans validation OIDC'}
                    >
                      <Shield size={8} />
                      {booking.authMode === 'Bearer' ? 'JWT' : 'Simulé'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onCancelBooking(booking.id)}
                    style={{ 
                      color: 'var(--status-error)', 
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      gap: '6px',
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    }}
                  >
                    <Trash2 size={14} />
                    Annuler
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel flex-center" style={{
          padding: '80px 20px',
          textAlign: 'center',
          flexDirection: 'column',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.01)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '20px',
            borderRadius: '50%',
            display: 'flex',
            color: 'var(--text-muted)'
          }}>
            <Plane size={36} style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Aucune réservation active</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
              Vous n'avez pas encore réservé de place de vol. Parcourez les offres disponibles et effectuez une réservation.
            </p>
          </div>
        </div>
      )}

      {/* Responsiveness style tag for table grid */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          div[style*="justify-content: flex-end"] {
            grid-column: span 2;
            justify-content: stretch !important;
          }
        }
      `}</style>
    </div>
  );
}
