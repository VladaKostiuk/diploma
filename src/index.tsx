import { CssBaseline, ThemeProvider } from '@mui/material';
import { App } from 'components/app/App';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from 'theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
