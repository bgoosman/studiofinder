import { createRoot } from "react-dom/client";
import AppLoader from "./AppLoader";

export default function createStudioFinder() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(<AppLoader />);
  const appLoader = document.getElementById("app-loader")!;
  appLoader.remove();
}
