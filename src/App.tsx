import { AppRouter } from "./router";

import { TemaProvider } from "./contexts/TemaContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { NotifProvider } from "./contexts/NotifContext";
import { ChatProvider } from "./contexts/ChatContext";

export default function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <NotifProvider>
          <ChatProvider>
            <AppProvider>
              <AppRouter />
            </AppProvider>
          </ChatProvider>
        </NotifProvider>
      </AuthProvider>
    </TemaProvider>
  );
}
