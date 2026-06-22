import React, { useState } from 'react';
import { Plane, Calendar, CreditCard, Armchair, ShieldCheck, Lock } from 'lucide-react';

export default function FlightCard({ flight, isBooked, onBook, user }) {
  const [isBooking, setIsBooking] = useState(false);

  // Formatting date for French display
  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('fr-FR', options);
    } catch {
      return dateStr;
    }
  };

  // Color mapping for airlines
  const getAirlineColor = (compagnie) => {
    const comp = compagnie.toLowerCase();
    if (comp.includes('france')) return 'linear-gradient(135deg, #002366, #e30a17)'; // Air France
    if (comp.includes('lufthansa')) return 'linear-gradient(135deg, #071D49, #FDB913)'; // Lufthansa
    if (comp.includes('ryanair')) return 'linear-gradient(135deg, #0033A0, #F1C40F)'; // Ryanair
    if (comp.includes('easyjet')) return 'linear-gradient(135deg, #FF6600, #555555)'; // EasyJet
    if (comp.includes('emirates')) return 'linear-gradient(135deg, #D71921, #007A33)'; // Emirates
    return 'linear-gradient(135deg, var(--primary), var(--secondary))';
  };

  const handleBookClick = async () => {
    setIsBooking(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onBook(flight);
    setIsBooking(false);
  };

  return (
    <div className="glass-panel glass-panel-interactive" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top bar with airline colors */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: getAirlineColor(flight.compagnie)
      }} />

      {/* Header Info */}
      <div className="flex-between">
        <div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {flight.compagnie}
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
            Vol {flight.vol}
          </h3>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-light)',
          padding: '8px 12px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Armchair size={16} style={{ color: 'var(--accent)' }} />
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1 }}>Siège</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{flight.place}</p>
          </div>
        </div>
      </div>

      {/* Flight Details Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '8px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{formatDate(flight.date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <CreditCard size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            {flight.prix} €
          </span>
        </div>
      </div>

      {/* Footer Booking Actions */}
      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {isBooked ? (
          <div className="flex-center" style={{
            background: 'var(--status-success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--status-success)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            gap: '8px'
          }}>
            <ShieldCheck size={18} />
            Place Réservée
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="btn btn-primary"
              disabled={isBooking}
              onClick={handleBookClick}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.9rem'
              }}
            >
              {isBooking ? (
                <>
                  <div className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                    marginRight: '6px'
                  }} />
                  Réservation...
                </>
              ) : (
                'Réserver ce vol'
              )}
            </button>

            {!user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                color: 'var(--status-warning)',
                fontSize: '0.7rem',
                fontWeight: 500
              }}>
                <Lock size={10} />
                <span>Simulation : JWT manquant (Mode Public)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spinner animation injected */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
