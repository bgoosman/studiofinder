import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App";

export default function createStudioFinder() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
  const appLoader = document.getElementById("app-loader")!;
  appLoader.remove();
}
