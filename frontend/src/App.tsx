import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import InventorySearch from './components/InventorySearch';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <h1>Hardware Inventory Lookup</h1>
        <InventorySearch />
      </div>
    </ThemeProvider>
  );
};

export default App;
