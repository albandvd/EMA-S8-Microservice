import React, { useState, useMemo } from 'react';
import FlightCard from './FlightCard';
import { Search, RefreshCw, SlidersHorizontal, Trash2 } from 'lucide-react';

export default function FlightSearch({ flights, bookings, onBookFlight, onRefresh, user, isLoading }) {
  const [filterAirline, setFilterAirline] = useState('');
  const [filterFlightNum, setFilterFlightNum] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState(800);
  const [filterDate, setFilterDate] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Extract unique airlines for selection dropdown
  const airlines = useMemo(() => {
    const list = flights.map(f => f.compagnie);
    return [...new Set(list)];
  }, [flights]);

  // Compute filtered flights
  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      // Airline filter
      if (filterAirline && flight.compagnie !== filterAirline) return false;
      
      // Flight number filter (case insensitive)
      if (filterFlightNum && !flight.vol.toLowerCase().includes(filterFlightNum.toLowerCase())) return false;
      
      // Price filter
      if (flight.prix > filterMaxPrice) return false;
      
      // Date filter (string partial match or exact)
      if (filterDate && flight.date !== filterDate) return false;
      
      return true;
    });
  }, [flights, filterAirline, filterFlightNum, filterMaxPrice, filterDate]);

  const handleResetFilters = () => {
    setFilterAirline('');
    setFilterFlightNum('');
    setFilterMaxPrice(800);
    setFilterDate('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      animation: 'fadeIn 0.3s ease-out',
      width: '100%'
    }}>
      {/* Header controls */}
      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Recherche de Vols</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Consultez les offres et réservez des places en temps réel.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ gap: '6px' }}
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Masquer Filtres' : 'Afficher Filtres'}
          </button>
          
          <button 
            className="btn btn-outline-primary" 
            onClick={onRefresh}
            disabled={isLoading}
            style={{ gap: '6px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin-animation' : ''} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="glass-panel" style={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          alignItems: 'end',
          background: 'rgba(15, 23, 42, 0.3)',
          border: '1px solid var(--border-light)'
        }}>
          {/* Airline filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Compagnie Aérienne</label>
            <select 
              className="form-input form-select"
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
            >
              <option value="">Toutes les compagnies</option>
              {airlines.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Flight Number filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Numéro de Vol</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: AF-12"
                value={filterFlightNum}
                onChange={(e) => setFilterFlightNum(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <Search size={16} style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
            </div>
          </div>

          {/* Date filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date du Vol</label>
            <input 
              type="date" 
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Price limit filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="flex-between" style={{ marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Prix Maximum</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>{filterMaxPrice} €</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="1000" 
              step="10"
              className="form-input"
              value={filterMaxPrice}
              onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
              style={{ padding: '8px 0', cursor: 'pointer' }}
            />
          </div>

          {/* Clean filters CTA */}
          <button 
            className="btn btn-secondary" 
            onClick={handleResetFilters}
            style={{ width: '100%', gap: '6px', height: '45px' }}
          >
            <Trash2 size={16} />
            Réinitialiser
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="glass-panel flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(99, 102, 241, 0.1)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Récupération des vols...</p>
        </div>
      ) : (
        <>
          {/* Results summary */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filteredFlights.length} vol{filteredFlights.length !== 1 ? 's' : ''} correspondant{filteredFlights.length !== 1 ? 's' : ''} à vos critères de recherche.
          </p>

          {/* Flights Grid */}
          {filteredFlights.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredFlights.map(flight => {
                const isBooked = bookings.some(b => b.id === flight.id);
                return (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    isBooked={isBooked} 
                    onBook={onBookFlight}
                    user={user}
                  />
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="glass-panel flex-center" style={{
              padding: '60px 20px',
              textAlign: 'center',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '20px',
                borderRadius: '50%',
                display: 'flex',
                color: 'var(--text-muted)'
              }}>
                <Search size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Aucun vol trouvé</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
                  Ajustez vos filtres de recherche ou augmentez le prix maximum pour afficher plus d'offres de vol.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={handleResetFilters} style={{ marginTop: '10px' }}>
                Effacer les filtres
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
