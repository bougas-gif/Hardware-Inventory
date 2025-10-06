import React, { useState } from 'react';

const InventorySearch: React.FC = () => {
  const [sku, setSku] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // TODO: Implement search functionality
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        placeholder="Enter SKU..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default InventorySearch;
