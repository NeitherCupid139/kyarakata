import { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Products from "./pages/Products";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// UI Components
import CrtEffectProvider from "./components/ui/CrtEffectProvider";
import RetroEffects from "./components/ui/RetroEffects";
import Chapters from "./pages/Chapters";
import Novels from "./pages/Novels";
import WorldSettings from "./pages/WorldSettings";
import Characters from "./pages/Characters";
import Relationships from "./pages/Relationships";
import Events from "./pages/Events";

// Route guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user, loading } = useAuthStore();

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen terminal-bg">
				<div className="loading-retro text-[var(--terminal-green)]">
					正在加载系统
				</div>
			</div>
		);

	if (!user) return <Navigate to="/login" replace />;

	return <>{children}</>;
};

function App() {
	const { initialize } = useAuthStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<CrtEffectProvider>
			<RetroEffects enableNoise={true} enableGrid={true} bootSequence={true}>
				<Router>
					<Routes>
						<Route path="/login" element={<Login />} />

						<Route
							path="/"
							element={
								<ProtectedRoute>
									<DashboardLayout />
								</ProtectedRoute>
							}
						>
							<Route index element={<Dashboard />} />

							<Route path="products" element={<Products />} />
							<Route path="chapters" element={<Chapters />} />
							<Route path="novels" element={<Novels />} />
							<Route path="world-settings" element={<WorldSettings />} />
							<Route path="characters" element={<Characters />} />
							<Route path="relationships" element={<Relationships />} />
							<Route path="events" element={<Events />} />
							<Route path="settings" element={<Settings />} />
						</Route>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</Router>
			</RetroEffects>
		</CrtEffectProvider>
	);
}

export default App;
