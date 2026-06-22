import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FlightSearch from './components/FlightSearch';
import MyBookings from './components/MyBookings';
import DevConsole from './components/DevConsole';

const MOCK_FLIGHTS = [
  { id: 'FL-101', compagnie: 'Air France', vol: 'AF-1015', place: '14A', prix: 185, date: '2026-06-25' },
  { id: 'FL-102', compagnie: 'Lufthansa', vol: 'LH-402', place: '07F', prix: 210, date: '2026-06-26' },
  { id: 'FL-103', compagnie: 'Ryanair', vol: 'FR-8824', place: '22C', prix: 49, date: '2026-06-28' },
  { id: 'FL-104', compagnie: 'EasyJet', vol: 'EZ-911', place: '18D', prix: 75, date: '2026-06-25' },
  { id: 'FL-105', compagnie: 'Emirates', vol: 'EK-074', place: '02A', prix: 690, date: '2026-07-02' },
  { id: 'FL-106', compagnie: 'Air France', vol: 'AF-1882', place: '10B', prix: 145, date: '2026-06-29' },
  { id: 'FL-107', compagnie: 'Lufthansa', vol: 'LH-2248', place: '15F', prix: 195, date: '2026-06-30' },
  { id: 'FL-108', compagnie: 'Ryanair', vol: 'FR-1048', place: '28A', prix: 39, date: '2026-07-05' },
  { id: 'FL-109', compagnie: 'Emirates', vol: 'EK-101', place: '03D', prix: 750, date: '2026-07-07' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [simulatedJwt, setSimulatedJwt] = useState('');
  const [flights, setFlights] = useState(MOCK_FLIGHTS);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  const [devSettings, setDevSettings] = useState({
    apiMode: 'mock',
    apiUrl: 'http://localhost:8080/java-rest-server/api',
    keycloakEnabled: false,
    keycloakRealm: 'ema-s8',
    keycloakClientId: 'aeroflow-web'
  });

  // Base64URL-safe encoding for JWT mockup
  const generateSimulatedJwt = () => {
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: "keycloak-s8-key-id-2026"
    };
    
    const payload = {
      exp: now + 3600, // 1 hour expiration
      iat: now,
      auth_time: now,
      jti: "d3b07384-d113-4b6e-ac4f-6f960f898394",
      iss: `http://localhost:8080/auth/realms/${devSettings.keycloakRealm}`,
      aud: devSettings.keycloakClientId,
      sub: "u-59df240-410a",
      typ: "Bearer",
      azp: devSettings.keycloakClientId,
      realm_access: {
        roles: ["user", "flight-booker"]
      },
      resource_access: {
        "aeroflow-api": {
          roles: ["book-flights", "view-flights"]
        }
      },
      scope: "openid email profile",
      email_verified: true,
      name: "Jean Dupont",
      preferred_username: "jdupont",
      given_name: "Jean",
      family_name: "Dupont",
      email: "jean.dupont@mines-ales.org",
      provider: "Keycloak OIDC"
    };

    const base64UrlEncode = (obj) => {
      const json = JSON.stringify(obj);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const headerEnc = base64UrlEncode(header);
    const payloadEnc = base64UrlEncode(payload);
    const signature = "c3RhdGljX21vY2tfb3BlbmlkX3NpZ25hdHVyZV9mb3JfcGFzc2luZ190cF9zOF9leGFt";

    return `${headerEnc}.${payloadEnc}.${signature}`;
  };

  // Toast Notification Helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Dev Console request logging
  const logApiRequest = (method, url, headers, status, statusText, data) => {
    setApiLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        method,
        url,
        headers,
        status,
        statusText,
        data
      },
      ...prev
    ]);
  };

  // Handle Login simulation
  const handleLogin = () => {
    const jwt = generateSimulatedJwt();
    setSimulatedJwt(jwt);
    setUser({
      name: "Jean Dupont",
      email: "jean.dupont@mines-ales.org",
      given_name: "Jean",
      provider: "Keycloak OIDC",
      role: "student"
    });
    showNotification("Authentification simulée réussie via Keycloak !");
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setSimulatedJwt('');
    showNotification("Session déconnectée avec succès.", "info");
  };

  // API actions: Fetch Flights
  const loadFlights = async () => {
    setIsLoading(true);
    
    if (devSettings.apiMode === 'live') {
      const url = `${devSettings.apiUrl}/vols`;
      const headers = {};
      if (simulatedJwt) {
        headers['Authorization'] = `Bearer ${simulatedJwt}`;
      }

      try {
        const response = await fetch(url, { headers });
        let data = [];
        
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            // Text or XML fallback handling
            const text = await response.text();
            data = text; // or parse XML if needed
          }
          
          logApiRequest('GET', url, headers, response.status, response.statusText, data);
          
          if (Array.isArray(data)) {
            setFlights(data);
          }
          showNotification("Vols actualisés avec succès depuis le serveur REST !");
        } else {
          const errText = await response.text();
          logApiRequest('GET', url, headers, response.status, response.statusText, errText);
          showNotification(`Erreur REST: ${response.status} ${response.statusText}`, 'error');
          // Fallback
          setFlights(MOCK_FLIGHTS);
        }
      } catch (err) {
        logApiRequest('GET', url, headers, 0, 'Connection Failed (CORS/Network)', err.message);
        showNotification("Impossible de joindre le serveur REST. Mode simulé activé en fallback.", "error");
        setFlights(MOCK_FLIGHTS);
      }
    } else {
      // Mock Mode
      await new Promise(resolve => setTimeout(resolve, 600));
      logApiRequest('GET', '/vols (Simulé)', null, 200, 'OK', MOCK_FLIGHTS);
      setFlights(MOCK_FLIGHTS);
      showNotification("Vols simulés actualisés.");
    }
    
    setIsLoading(false);
  };

  // Trigger loading flights on startup/change mode
  useEffect(() => {
    loadFlights();
  }, [devSettings.apiMode, devSettings.apiUrl]);

  // Book a flight
  const handleBookFlight = async (flight) => {
    // Check Keycloak rules
    if (devSettings.keycloakEnabled && !user) {
      logApiRequest('POST', `/reservations (Rejeté)`, null, 403, 'Forbidden', { error: "Accès refusé. Jeton Bearer manquant ou invalide." });
      showNotification("Réservation refusée: Authentification Keycloak OIDC requise (HTTP 403) !", "error");
      return;
    }

    const bookingRef = `RES-${flight.id}`;
    const payload = {
      volId: flight.id,
      compagnie: flight.compagnie,
      vol: flight.vol,
      place: flight.place,
      prix: flight.prix,
      date: flight.date,
      username: user ? user.name : 'Anonyme',
      bookingDate: new Date().toISOString()
    };

    if (devSettings.apiMode === 'live') {
      const url = `${devSettings.apiUrl}/reservations`;
      const headers = {
        'Content-Type': 'application/json'
      };
      if (simulatedJwt) {
        headers['Authorization'] = `Bearer ${simulatedJwt}`;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json().catch(() => null);
        logApiRequest('POST', url, headers, response.status, response.statusText, responseData || payload);

        if (response.ok) {
          setBookings(prev => [...prev, { ...flight, authMode: 'Bearer', ref: bookingRef }]);
          showNotification("Vol réservé avec succès sur le serveur backend !");
        } else {
          showNotification(`Erreur de réservation REST: ${response.status}`, 'error');
        }
      } catch (err) {
        logApiRequest('POST', url, headers, 0, 'Connection Failed (CORS/Network)', err.message);
        showNotification("Erreur de connexion. Réservation simulée localement.", "warning");
        setBookings(prev => [...prev, { ...flight, authMode: user ? 'Bearer' : 'Mock', ref: bookingRef }]);
      }
    } else {
      // Mock Mode
      logApiRequest('POST', '/reservations (Simulé)', null, 201, 'Created', payload);
      setBookings(prev => [...prev, { ...flight, authMode: user ? 'Bearer' : 'Mock', ref: bookingRef }]);
      showNotification(`Vol ${flight.vol} réservé ! Siège : ${flight.place}`);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    const flight = bookings.find(b => b.id === bookingId);
    
    if (devSettings.apiMode === 'live') {
      const url = `${devSettings.apiUrl}/reservations/${bookingId}`;
      const headers = {};
      if (simulatedJwt) {
        headers['Authorization'] = `Bearer ${simulatedJwt}`;
      }

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers
        });
        
        logApiRequest('DELETE', url, headers, response.status, response.statusText, { message: `Réservation ${bookingId} annulée` });
        
        if (response.ok) {
          setBookings(prev => prev.filter(b => b.id !== bookingId));
          showNotification("Réservation annulée sur le serveur REST.");
        } else {
          showNotification(`Erreur d'annulation REST: ${response.status}`, 'error');
        }
      } catch (err) {
        logApiRequest('DELETE', url, headers, 0, 'Connection Failed (CORS/Network)', err.message);
        showNotification("Erreur de réseau. Annulation simulée localement.", "warning");
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } else {
      // Mock Mode
      logApiRequest('DELETE', `/reservations/${bookingId} (Simulé)`, null, 200, 'OK', { id: bookingId });
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      showNotification("Réservation annulée.");
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 9999,
          color: 'white',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: notification.type === 'error' ? 'var(--status-error)' : 
                      notification.type === 'warning' ? 'var(--status-warning)' :
                      notification.type === 'info' ? 'var(--status-info)' : 'var(--status-success)',
          animation: 'slideInRight 0.3s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            activeBookingsCount={bookings.length}
            devSettings={devSettings}
            mockFlightsCount={flights.length}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
        
        {activeTab === 'flights' && (
          <FlightSearch 
            flights={flights}
            bookings={bookings}
            onBookFlight={handleBookFlight}
            onRefresh={loadFlights}
            user={user}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'bookings' && (
          <MyBookings 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            user={user}
          />
        )}
        
        {activeTab === 'devconsole' && (
          <DevConsole 
            devSettings={devSettings}
            setDevSettings={setDevSettings}
            simulatedJwt={simulatedJwt}
            apiLogs={apiLogs}
            onClearLogs={() => setApiLogs([])}
          />
        )}
      </main>
    </div>
  );
}
