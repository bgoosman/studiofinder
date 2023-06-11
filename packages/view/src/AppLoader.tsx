import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App";

export default function createStudioFinder() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        globalStyles: (theme) => ({
          h2: {
            margin: "0",
          },
          h3: {
            margin: "0",
          },
          h4: {
            margin: "0",
          },
        }),
      }}
    >
      <App />
    </MantineProvider>
  );
  const appLoader = document.getElementById("app-loader")!;
  appLoader.remove();
}
