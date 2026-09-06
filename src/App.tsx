import AppShell from "./components/AppShell";
import { AppProvider } from "./store/AppContext";

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
