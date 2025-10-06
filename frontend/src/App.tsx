import React from 'react';
import { SquareProvider, SquareTheme } from '@square/ui';
import { AuthProvider } from '@square/auth';

function App() {
  return (
    <SquareProvider theme={SquareTheme.light}>
      <AuthProvider>
        <div className="App">
          <h1>Inventory Lookup</h1>
          {/* Add components here */}
        </div>
      </AuthProvider>
    </SquareProvider>
  );
}

export default App;
