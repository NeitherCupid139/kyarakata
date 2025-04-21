import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import CrtEffectProvider from "@/components/ui/CrtEffectProvider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CrtEffectProvider>
			<App />
		</CrtEffectProvider>
	</StrictMode>
);
