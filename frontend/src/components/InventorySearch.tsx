import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { searchInventory, searchSKUs } from '../services/api';

interface InventoryData {
  sku: string;
  snapshot_date: string;
  description: string;
  inventory: Array<{
    FACILITY: string;
    SUBINVENTORY_CODE: string;
    QUANTITY: number;
    AVAILABLE_TO_RESERVE: number;
    RESERVED: number;
  }>;
  totals: {
    total_quantity: number;
    total_available: number;
    total_reserved: number;
  };
}

interface SearchResult {
  item_number: string;
  description: string;
}

const InventorySearch: React.FC = () => {
  const { user, login } = useAuth();
  const [sku, setSku] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InventoryData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (selectedSku: string) => {
    if (!selectedSku) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchInventory(selectedSku);
      setData(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        login();
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSku(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const { results } = await searchSKUs(value);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Please log in to access inventory data
        </Typography>
        <Button variant="contained" onClick={login}>
          Log in with Square SSO
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Autocomplete
          freeSolo
          options={searchResults}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : `${option.item_number} - ${option.description}`
          }
          sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by SKU or Description"
              variant="outlined"
              error={!!error}
              helperText={error}
            />
          )}
          onInputChange={(_, value) => handleSearchChange(value)}
          onChange={(_, value) => {
            if (value && typeof value !== 'string') {
              setSku(value.item_number);
              handleSearch(value.item_number);
            }
          }}
        />
        <Button
          variant="contained"
          onClick={() => handleSearch(sku)}
          disabled={loading || !sku}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {data && (
        <Box>
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">Summary</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 2 }}>
              <Paper sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2">Total Quantity</Typography>
                <Typography variant="h4">{data.totals.total_quantity}</Typography>
              </Paper>
              <Paper sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2">Available to Reserve</Typography>
                <Typography variant="h4">{data.totals.total_available}</Typography>
              </Paper>
              <Paper sx={{ padding: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2">Reserved</Typography>
                <Typography variant="h4">{data.totals.total_reserved}</Typography>
              </Paper>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Facility</TableCell>
                  <TableCell>Subinventory</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell align="right">Reserved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.inventory.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.FACILITY}</TableCell>
                    <TableCell>{row.SUBINVENTORY_CODE}</TableCell>
                    <TableCell align="right">{row.QUANTITY}</TableCell>
                    <TableCell align="right">{row.AVAILABLE_TO_RESERVE}</TableCell>
                    <TableCell align="right">{row.RESERVED}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default InventorySearch;
