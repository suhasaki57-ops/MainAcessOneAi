import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SpeechProvider } from './context/SpeechContext';
import { SidebarProvider } from './context/SidebarContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { muiDarkTheme } from './styles/theme';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <ErrorBoundary>
      <MuiThemeProvider theme={muiDarkTheme}>
        <ThemeProvider>
          <SettingsProvider>
            <NotificationProvider>
              <AuthProvider>
                <SpeechProvider>
                  <SidebarProvider>
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </SidebarProvider>
                </SpeechProvider>
              </AuthProvider>
            </NotificationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
