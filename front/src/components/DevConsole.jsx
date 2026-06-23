import React, { useState, useEffect } from "react";
import {
	Terminal,
	Shield,
	Database,
	Settings,
	Play,
	CheckCircle,
	AlertCircle,
	Copy,
} from "lucide-react";

export default function DevConsole({
	devSettings,
	setDevSettings,
	simulatedJwt,
	apiLogs,
	onClearLogs,
}) {
	const [tokenInput, setTokenInput] = useState(simulatedJwt || "");
	const [jwtParts, setJwtParts] = useState({
		header: null,
		payload: null,
		valid: false,
	});
	const [copied, setCopied] = useState(false);

	// Parse JWT token
	useEffect(() => {
		if (!tokenInput) {
			setJwtParts({ header: null, payload: null, valid: false });
			return;
		}

		try {
			const parts = tokenInput.split(".");
			if (parts.length !== 3) {
				throw new Error("JWT must have 3 parts separated by dots");
			}

			// Base64URL decode helper
			const decodePart = (str) => {
				const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
				const jsonPayload = decodeURIComponent(
					window
						.atob(base64)
						.split("")
						.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
						.join(""),
				);
				return JSON.parse(jsonPayload);
			};

			const header = decodePart(parts[0]);
			const payload = decodePart(parts[1]);

			setJwtParts({
				header,
				payload,
				valid: true,
			});
		} catch (err) {
			setJwtParts({
				header: null,
				payload: err.message,
				valid: false,
			});
		}
	}, [tokenInput]);

	// Load the current simulated JWT when user requests it
	const handleLoadSimulatedJwt = () => {
		setTokenInput(simulatedJwt);
	};

	const handleCopyJwt = () => {
		navigator.clipboard.writeText(tokenInput);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Colorized JWT display parts
	const getColouredJwtToken = () => {
		if (!tokenInput) return "";
		const parts = tokenInput.split(".");
		if (parts.length !== 3)
			return <span style={{ color: "var(--status-error)" }}>{tokenInput}</span>;
		return (
			<>
				<span style={{ color: "#ff4a5a", wordBreak: "break-all" }}>
					{parts[0]}
				</span>
				<span style={{ color: "var(--text-primary)" }}>.</span>
				<span style={{ color: "#cd5cfa", wordBreak: "break-all" }}>
					{parts[1]}
				</span>
				<span style={{ color: "var(--text-primary)" }}>.</span>
				<span style={{ color: "#00d6ef", wordBreak: "break-all" }}>
					{parts[2]}
				</span>
			</>
		);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "30px",
				animation: "fadeIn 0.3s ease-out",
				width: "100%",
			}}
		>
			{/* Page Title */}
			<div>
				<h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
					Console Développeur & Sécurité
				</h2>
				<p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
					Simulez, inspectez, et connectez votre application REST et Keycloak.
				</p>
			</div>

			{/* Main layout: Config and Terminal */}
			<div className='grid-cols-2'>
				{/* Left Side: Server Configuration */}
				<div
					className='glass-panel'
					style={{
						padding: "24px",
						display: "flex",
						flexDirection: "column",
						gap: "20px",
					}}
				>
					<h3
						style={{
							fontSize: "1.2rem",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Settings
							size={20}
							style={{ color: "var(--primary)" }}
						/>
						Configuration des Services
					</h3>

					{/* API Mode Selector */}
					<div className='form-group'>
						<label className='form-label'>Mode d'API REST</label>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								type='button'
								className={`btn ${devSettings.apiMode === "mock" ? "btn-primary" : "btn-secondary"}`}
								style={{ flex: 1, padding: "10px" }}
								onClick={() =>
									setDevSettings((prev) => ({ ...prev, apiMode: "mock" }))
								}
							>
								Simulé (Mocké)
							</button>
							<button
								type='button'
								className={`btn ${devSettings.apiMode === "live" ? "btn-accent" : "btn-secondary"}`}
								style={{ flex: 1, padding: "10px" }}
								onClick={() =>
									setDevSettings((prev) => ({ ...prev, apiMode: "live" }))
								}
							>
								Connecté (Live REST)
							</button>
						</div>
						<p
							style={{
								fontSize: "0.75rem",
								color: "var(--text-muted)",
								marginTop: "6px",
							}}
						>
							{devSettings.apiMode === "mock"
								? "L'application utilise des données locales statiques (aucun backend requis)."
								: "L'application tente d'envoyer des requêtes réelles à l'URL configurée ci-dessous."}
						</p>
					</div>

					{/* Endpoint Input */}
					<div className='form-group'>
						<label className='form-label'>URL Base de l'API REST Backend</label>
						<input
							type='text'
							className='form-input'
							value={devSettings.apiUrl}
							onChange={(e) =>
								setDevSettings((prev) => ({ ...prev, apiUrl: e.target.value }))
							}
							disabled={devSettings.apiMode === "mock"}
							placeholder='http://localhost:8080/java-rest-server/api'
						/>
						<p
							style={{
								fontSize: "0.75rem",
								color: "var(--text-muted)",
								marginTop: "4px",
							}}
						>
							Correspond aux endpoints : <code>{"{apiUrl}/vols"}</code> et{" "}
							<code>{"{apiUrl}/reservations"}</code>
						</p>
					</div>

					<div
						style={{
							borderTop: "1px solid rgba(255,255,255,0.05)",
							paddingTop: "15px",
						}}
					/>

					{/* Keycloak Simulation */}
					<h3
						style={{
							fontSize: "1.1rem",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Shield
							size={18}
							style={{ color: "var(--secondary)" }}
						/>
						Configuration Keycloak OIDC
					</h3>

					<div className='form-group'>
						<label className='form-label'>
							Simuler Authentification Keycloak
						</label>
						<div style={{ display: "flex", gap: "10px" }}>
							<button
								type='button'
								className={`btn ${devSettings.keycloakEnabled ? "btn-primary" : "btn-secondary"}`}
								style={{ flex: 1, padding: "10px" }}
								onClick={() =>
									setDevSettings((prev) => ({ ...prev, keycloakEnabled: true }))
								}
							>
								Actif (OIDC Obligatoire)
							</button>
							<button
								type='button'
								className={`btn ${!devSettings.keycloakEnabled ? "btn-primary" : "btn-secondary"}`}
								style={{ flex: 1, padding: "10px" }}
								onClick={() =>
									setDevSettings((prev) => ({
										...prev,
										keycloakEnabled: false,
									}))
								}
							>
								Inactif (Mode Libre)
							</button>
						</div>
						<p
							style={{
								fontSize: "0.75rem",
								color: "var(--text-muted)",
								marginTop: "6px",
							}}
						>
							Si actif, les boutons de réservation afficheront un message
							d'interdiction (403/non authentifié) si aucun jeton n'est
							configuré.
						</p>
					</div>

					<div className='form-group'>
						<label className='form-label'>URL du Serveur Keycloak</label>
						<input
							type='text'
							className='form-input'
							value={devSettings.keycloakUrl || "http://localhost:8080"}
							onChange={(e) =>
								setDevSettings((prev) => ({
									...prev,
									keycloakUrl: e.target.value,
								}))
							}
							placeholder='http://localhost:8080'
							disabled={!devSettings.keycloakEnabled}
						/>
					</div>

					<div className='form-group'>
						<label className='form-label'>Realm Keycloak & Client ID</label>
						<div style={{ display: "flex", gap: "10px" }}>
							<input
								type='text'
								className='form-input'
								value={devSettings.keycloakRealm}
								onChange={(e) =>
									setDevSettings((prev) => ({
										...prev,
										keycloakRealm: e.target.value,
									}))
								}
								style={{ flex: 1 }}
								disabled={!devSettings.keycloakEnabled}
							/>
							<input
								type='text'
								className='form-input'
								value={devSettings.keycloakClientId}
								onChange={(e) =>
									setDevSettings((prev) => ({
										...prev,
										keycloakClientId: e.target.value,
									}))
								}
								placeholder='aeroflow-web'
								style={{ flex: 1 }}
								disabled={!devSettings.keycloakEnabled}
							/>
						</div>
					</div>
				</div>

				{/* Right Side: Network terminal simulator */}
				<div
					className='glass-panel'
					style={{
						padding: "24px",
						display: "flex",
						flexDirection: "column",
						backgroundColor: "#05070f",
						border: "1px solid rgba(255,255,255,0.05)",
						minHeight: "400px",
					}}
				>
					<div
						className='flex-between'
						style={{ marginBottom: "14px" }}
					>
						<h3
							style={{
								fontSize: "1rem",
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontFamily: "var(--font-mono)",
							}}
						>
							<Terminal
								size={18}
								style={{ color: "var(--accent)" }}
							/>
							HTTP Network Logs
						</h3>
						<button
							className='btn btn-secondary'
							onClick={onClearLogs}
							style={{
								padding: "4px 10px",
								fontSize: "0.75rem",
								borderRadius: "4px",
							}}
						>
							Effacer
						</button>
					</div>

					{/* Logs scrollable container */}
					<div
						style={{
							flex: 1,
							overflowY: "auto",
							maxHeight: "350px",
							fontFamily: "var(--font-mono)",
							fontSize: "0.8rem",
							lineHeight: "1.5",
							color: "#a6accd",
							display: "flex",
							flexDirection: "column",
							gap: "12px",
							padding: "12px",
							borderRadius: "8px",
							backgroundColor: "rgba(0,0,0,0.3)",
							border: "1px solid rgba(255,255,255,0.03)",
						}}
					>
						{apiLogs.length > 0 ? (
							apiLogs.map((log, idx) => (
								<div
									key={idx}
									style={{
										paddingBottom: "8px",
										borderBottom:
											idx !== apiLogs.length - 1
												? "1px solid rgba(255,255,255,0.03)"
												: "none",
									}}
								>
									<div style={{ color: "var(--accent)", fontWeight: 600 }}>
										&gt; {log.method} {log.url}
									</div>
									{log.headers && (
										<div
											style={{
												color: "var(--text-muted)",
												paddingLeft: "10px",
												fontSize: "0.75rem",
											}}
										>
											{Object.entries(log.headers).map(([k, v]) => (
												<div key={k}>
													{k}: {v.substring(0, 30)}
													{v.length > 30 ? "..." : ""}
												</div>
											))}
										</div>
									)}
									<div
										style={{
											color:
												log.status >= 200 && log.status < 300
													? "var(--status-success)"
													: "var(--status-error)",
											paddingLeft: "10px",
											fontWeight: 500,
											marginTop: "2px",
										}}
									>
										Response: {log.status} ({log.statusText})
									</div>
									<pre
										style={{
											color: "#80cbc4",
											paddingLeft: "10px",
											fontSize: "0.7rem",
											overflowX: "auto",
											whiteSpace: "pre-wrap",
											wordBreak: "break-all",
										}}
									>
										{JSON.stringify(log.data, null, 2)}
									</pre>
								</div>
							))
						) : (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
									color: "var(--text-muted)",
								}}
							>
								Aucune requête enregistrée. Effectuez une recherche de vol ou
								une réservation.
							</div>
						)}
					</div>
				</div>
			</div>

			{/* JWT Decoder Section (Interactive jwt.io lookalike) */}
			<div
				className='glass-panel'
				style={{
					padding: "28px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
				}}
			>
				<div className='flex-between'>
					<h3
						style={{
							fontSize: "1.2rem",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<Shield
							size={20}
							style={{ color: "var(--primary)" }}
						/>
						Décodeur de Jeton JWT (jwt.io)
					</h3>
					<div style={{ display: "flex", gap: "10px" }}>
						<button
							className='btn btn-secondary'
							onClick={handleLoadSimulatedJwt}
							style={{ fontSize: "0.8rem", padding: "6px 12px" }}
						>
							Charger jeton simulé
						</button>
						<button
							className='btn btn-secondary'
							onClick={handleCopyJwt}
							disabled={!tokenInput}
							style={{ fontSize: "0.8rem", padding: "6px 12px", gap: "4px" }}
						>
							<Copy size={12} />
							{copied ? "Copié !" : "Copier"}
						</button>
					</div>
				</div>

				<p
					style={{
						color: "var(--text-muted)",
						fontSize: "0.85rem",
						marginTop: "-10px",
					}}
				>
					Collez le jeton d'accès (Access Token) extrait de votre Keycloak lors
					de l'étape 6 du TP pour le décoder et inspecter ses claims.
				</p>

				{/* Decoder Interface Grid */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: "24px",
					}}
				>
					{/* JWT Input side */}
					<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
						<label
							className='form-label'
							style={{ fontFamily: "var(--font-mono)" }}
						>
							Encoded JWT Token
						</label>
						<textarea
							className='form-input'
							value={tokenInput}
							onChange={(e) => setTokenInput(e.target.value)}
							placeholder='Collez votre jeton JWT ici...'
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: "0.78rem",
								minHeight: "280px",
								resize: "vertical",
								backgroundColor: "#04060b",
								lineHeight: "1.6",
								border: "1px solid var(--border-light)",
							}}
						/>
						{tokenInput && (
							<div
								className='glass-panel'
								style={{
									padding: "12px",
									marginTop: "10px",
									fontSize: "0.78rem",
									fontFamily: "var(--font-mono)",
									backgroundColor: "#04060b",
									maxHeight: "120px",
									overflowY: "auto",
								}}
							>
								{getColouredJwtToken()}
							</div>
						)}
					</div>

					{/* Decoded results side */}
					<div
						style={{ display: "flex", flexDirection: "column", gap: "16px" }}
					>
						{/* Header block */}
						<div
							style={{ display: "flex", flexDirection: "column", gap: "6px" }}
						>
							<span
								className='form-label'
								style={{ fontFamily: "var(--font-mono)", color: "#ff4a5a" }}
							>
								Header: Algorithm & Token Type
							</span>
							<pre
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: "0.8rem",
									backgroundColor: "#04060b",
									padding: "12px",
									borderRadius: "8px",
									border: "1px solid rgba(255,74,90,0.2)",
									color: "#ff4a5a",
									overflowX: "auto",
									minHeight: "70px",
								}}
							>
								{jwtParts.header
									? JSON.stringify(jwtParts.header, null, 2)
									: "{}"}
							</pre>
						</div>

						{/* Payload block */}
						<div
							style={{ display: "flex", flexDirection: "column", gap: "6px" }}
						>
							<span
								className='form-label'
								style={{ fontFamily: "var(--font-mono)", color: "#cd5cfa" }}
							>
								Payload: Claims (Data)
							</span>
							<pre
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: "0.8rem",
									backgroundColor: "#04060b",
									padding: "12px",
									borderRadius: "8px",
									border: jwtParts.valid
										? "1px solid rgba(205,92,250,0.2)"
										: "1px solid rgba(239,68,68,0.2)",
									color: jwtParts.valid ? "#cd5cfa" : "var(--status-error)",
									overflowX: "auto",
									minHeight: "150px",
									maxHeight: "280px",
									overflowY: "auto",
								}}
							>
								{jwtParts.valid
									? JSON.stringify(jwtParts.payload, null, 2)
									: tokenInput
										? jwtParts.payload
										: "{}"}
							</pre>
						</div>

						{/* Decoded Status notification */}
						<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							{tokenInput ? (
								jwtParts.valid ? (
									<>
										<CheckCircle
											size={16}
											style={{ color: "var(--status-success)" }}
										/>
										<span
											style={{
												fontSize: "0.8rem",
												color: "var(--status-success)",
												fontWeight: 500,
											}}
										>
											Signature de Jeton reconnue (Decodage Base64 valide)
										</span>
									</>
								) : (
									<>
										<AlertCircle
											size={16}
											style={{ color: "var(--status-error)" }}
										/>
										<span
											style={{
												fontSize: "0.8rem",
												color: "var(--status-error)",
												fontWeight: 500,
											}}
										>
											Format de jeton invalide
										</span>
									</>
								)
							) : (
								<span
									style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
								>
									En attente de saisie de jeton...
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
		</div>
	);
}
