import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables
export default defineConfig(({  }) => {

  return {
    plugins: [
      react()
    ]
  };
});
