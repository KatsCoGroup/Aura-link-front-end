import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { WalletProvider } from "./hooks/use-wallet";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<WalletProvider>
		<App />
	</WalletProvider>
);
