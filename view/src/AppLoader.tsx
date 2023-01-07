import { createRoot } from "react-dom/client";
import App from "./App";

export default function createStudioFinder() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(<App />);
  const appLoader = document.getElementById("app-loader")!;
  appLoader.remove();
}
