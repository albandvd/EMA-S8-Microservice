import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import FlightSearch from "./components/FlightSearch";
import MyBookings from "./components/MyBookings";
import DevConsole from "./components/DevConsole";

// Track Keycloak initialization configuration to avoid concurrent double-initialization in React 18 Strict Mode
let lastInitializedSettings = "";

export default function App() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [user, setUser] = useState(null);
	const [simulatedJwt, setSimulatedJwt] = useState("");
	const [flights, setFlights] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [apiLogs, setApiLogs] = useState([]);
	const [notification, setNotification] = useState(null);

	const [devSettings, setDevSettings] = useState({
		apiUrl: "http://localhost:3000",
		keycloakUrl: "http://localhost:8080",
		keycloakRealm: "ema-s8-microservices",
		keycloakClientId: "aeroflow-web",
	});

	const [keycloakInstance, setKeycloakInstance] = useState(null);
	const keycloakInitialized = useRef(false);

	// Toast Notification Helper
	const showNotification = (message, type = "success") => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 4000);
	};

	// Parse query parameters from Discord OAuth redirect
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const name = params.get("name");
		const email = params.get("email");
		const avatar = params.get("avatar");
		const provider = params.get("provider");

		if (name) {
			setUser({
				name,
				email: email || "Non partagé",
				avatar: avatar || null,
				provider: provider || "Discord",
				given_name: name.split(" ")[0],
			});
			showNotification(`Connecté avec succès via ${provider || "Discord"} !`);

			// Clean up parameters in address bar
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	// Initialize Keycloak client (OIDC Step 5)
	useEffect(() => {
		const settingsKey = `${devSettings.keycloakUrl}|${devSettings.keycloakRealm}|${devSettings.keycloakClientId}`;
		if (keycloakInitialized.current || lastInitializedSettings === settingsKey)
			return;

		// Set initialization indicators synchronously to prevent concurrent / duplicate attempts
		keycloakInitialized.current = true;
		lastInitializedSettings = settingsKey;

		const keycloak = new Keycloak({
			url: devSettings.keycloakUrl,
			realm: devSettings.keycloakRealm,
			clientId: devSettings.keycloakClientId,
		});

		keycloak
			.init({
				onLoad: "check-sso",
				silentCheckSsoRedirectUri:
					window.location.origin + "/silent-check-sso.html",
				checkLoginIframe: false,
			})
			.then((authenticated) => {
				setKeycloakInstance(keycloak);

				if (authenticated) {
					setUser({
						name:
							keycloak.tokenParsed.name ||
							keycloak.tokenParsed.preferred_username,
						email: keycloak.tokenParsed.email || "Non partagé",
						given_name:
							keycloak.tokenParsed.given_name ||
							keycloak.tokenParsed.preferred_username,
						provider: "Keycloak OIDC",
						avatar: null,
					});
					setSimulatedJwt(keycloak.token);
					showNotification("Authentifié auprès de Keycloak avec succès !");
				} else {
					setUser(null);
					setSimulatedJwt("");
				}
			})
			.catch((err) => {
				console.error("Erreur d'initialisation Keycloak:", err);
				showNotification(
					"Impossible de joindre le serveur Keycloak. Vérifiez l'instance Docker.",
					"error",
				);
			});
	}, [
		devSettings.keycloakUrl,
		devSettings.keycloakRealm,
		devSettings.keycloakClientId,
	]);

	// Dev Console request logging
	const logApiRequest = (method, url, headers, status, statusText, data) => {
		setApiLogs((prev) => [
			{
				timestamp: new Date().toLocaleTimeString(),
				method,
				url,
				headers,
				status,
				statusText,
				data,
			},
			...prev,
		]);
	};

	// Handle Login (real Keycloak redirect)
	const handleLogin = () => {
		if (keycloakInstance) {
			keycloakInstance.login();
		}
	};

	// Handle Logout (real Keycloak)
	const handleLogout = () => {
		if (keycloakInstance) {
			keycloakInstance.logout({ redirectUri: window.location.origin });
		}
	};

	// API actions: Fetch Flights
	const loadFlights = async () => {
		setIsLoading(true);
		const url = `${devSettings.apiUrl}/flights`;
		const headers = {};
		if (simulatedJwt) {
			headers["Authorization"] = `Bearer ${simulatedJwt}`;
		}

		try {
			const response = await fetch(url, { headers });
			let data = [];

			if (response.ok) {
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					data = await response.json();
				} else {
					const text = await response.text();
					data = text;
				}

				logApiRequest(
					"GET",
					url,
					headers,
					response.status,
					response.statusText,
					data,
				);

				if (Array.isArray(data)) {
					setFlights(data);
				}
				showNotification(
					"Vols actualisés avec succès depuis le serveur REST !",
				);
			} else {
				const errText = await response.text();
				logApiRequest(
					"GET",
					url,
					headers,
					response.status,
					response.statusText,
					errText,
				);
				showNotification(
					`Erreur REST: ${response.status} ${response.statusText}`,
					"error",
				);
				setFlights([]);
			}
		} catch (err) {
			logApiRequest(
				"GET",
				url,
				headers,
				0,
				"Connection Failed (CORS/Network)",
				err.message,
			);
			showNotification("Impossible de joindre le serveur REST.", "error");
			setFlights([]);
		}

		setIsLoading(false);
	};

	// Trigger loading flights on startup or when JWT changes
	useEffect(() => {
		loadFlights();
	}, [devSettings.apiUrl, simulatedJwt]);

	// Book a flight
	const handleBookFlight = async (flight) => {
		if (!user) {
			showNotification(
				"Réservation refusée: Authentification requise !",
				"error",
			);
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
			username: user.name,
			bookingDate: new Date().toISOString(),
		};

		const url = `${devSettings.apiUrl}/reservations`;
		const headers = {
			"Content-Type": "application/json",
		};
		if (simulatedJwt) {
			headers["Authorization"] = `Bearer ${simulatedJwt}`;
		}

		try {
			const response = await fetch(url, {
				method: "POST",
				headers,
				body: JSON.stringify(payload),
			});

			const responseData = await response.json().catch(() => null);
			logApiRequest(
				"POST",
				url,
				headers,
				response.status,
				response.statusText,
				responseData || payload,
			);

			if (response.ok) {
				setBookings((prev) => [
					...prev,
					{ ...flight, authMode: "Bearer", ref: bookingRef },
				]);
				showNotification("Vol réservé avec succès sur le serveur backend !");
			} else {
				showNotification(
					`Erreur de réservation REST: ${response.status}`,
					"error",
				);
			}
		} catch (err) {
			logApiRequest(
				"POST",
				url,
				headers,
				0,
				"Connection Failed (CORS/Network)",
				err.message,
			);
			showNotification(
				"Erreur de connexion. Impossible d'enregistrer la réservation.",
				"error",
			);
		}
	};

	// Cancel booking
	const handleCancelBooking = async (bookingId) => {
		const url = `${devSettings.apiUrl}/reservations/${bookingId}`;
		const headers = {};
		if (simulatedJwt) {
			headers["Authorization"] = `Bearer ${simulatedJwt}`;
		}

		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers,
			});

			logApiRequest(
				"DELETE",
				url,
				headers,
				response.status,
				response.statusText,
				{ message: `Réservation ${bookingId} annulée` },
			);

			if (response.ok) {
				setBookings((prev) => prev.filter((b) => b.id !== bookingId));
				showNotification("Réservation annulée sur le serveur REST.");
			} else {
				showNotification(
					`Erreur d'annulation REST: ${response.status}`,
					"error",
				);
			}
		} catch (err) {
			logApiRequest(
				"DELETE",
				url,
				headers,
				0,
				"Connection Failed (CORS/Network)",
				err.message,
			);
			showNotification("Erreur de réseau lors de l'annulation.", "error");
		}
	};

	const testSecureApi = async () => {
		const url = `${devSettings.apiUrl}/secure-data`;
		const headers = {};
		if (simulatedJwt) {
			headers["Authorization"] = `Bearer ${simulatedJwt}`;
		}

		try {
			const response = await fetch(url, { headers });
			const text = await response.text();
			let data = text;
			try {
				data = JSON.parse(text);
			} catch {
				// Keep as text if not valid JSON
			}

			logApiRequest(
				"GET (Test)",
				url,
				headers,
				response.status,
				response.statusText,
				data,
			);

			if (response.ok) {
				showNotification("Test API réussi : accès autorisé (200 OK) !", "success");
			} else {
				showNotification(
					`Test API échoué : ${response.status} ${response.statusText}`,
					"error",
				);
			}
		} catch (err) {
			logApiRequest(
				"GET (Test)",
				url,
				headers,
				0,
				"Connection Failed (CORS/Network)",
				err.message,
			);
			showNotification(
				"Test API échoué : Impossible de joindre le serveur REST.",
				"error",
			);
		}
	};

	return (
		<div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
			{/* Toast Notification */}
			{notification && (
				<div
					style={{
						position: "fixed",
						top: "24px",
						right: "24px",
						padding: "16px 24px",
						borderRadius: "12px",
						boxShadow: "var(--shadow-lg)",
						zIndex: 9999,
						color: "white",
						fontWeight: 600,
						fontSize: "0.95rem",
						display: "flex",
						alignItems: "center",
						gap: "10px",
						background:
							notification.type === "error"
								? "var(--status-error)"
								: notification.type === "warning"
									? "var(--status-warning)"
									: notification.type === "info"
										? "var(--status-info)"
										: "var(--status-success)",
						animation: "slideInRight 0.3s ease-out",
						border: "1px solid rgba(255, 255, 255, 0.1)",
					}}
				>
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
			<main
				style={{
					flex: 1,
					padding: "40px",
					maxWidth: "1200px",
					margin: "0 auto",
					overflowY: "auto",
					boxSizing: "border-box",
				}}
			>
				{activeTab === "dashboard" && (
					<Dashboard
						user={user}
						activeBookingsCount={bookings.length}
						devSettings={devSettings}
						mockFlightsCount={flights.length}
						onLogin={handleLogin}
						onLogout={handleLogout}
					/>
				)}

				{activeTab === "flights" && (
					<FlightSearch
						flights={flights}
						bookings={bookings}
						onBookFlight={handleBookFlight}
						onRefresh={loadFlights}
						user={user}
						isLoading={isLoading}
					/>
				)}

				{activeTab === "bookings" && (
					<MyBookings
						bookings={bookings}
						onCancelBooking={handleCancelBooking}
						user={user}
					/>
				)}

				{activeTab === "devconsole" && (
					<DevConsole
						devSettings={devSettings}
						setDevSettings={setDevSettings}
						simulatedJwt={simulatedJwt}
						apiLogs={apiLogs}
						onClearLogs={() => setApiLogs([])}
						onTestApi={testSecureApi}
					/>
				)}
			</main>
		</div>
	);
}
