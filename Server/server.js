require('dotenv').config();
import { listen } from './app';

const PORT = process.env.PORT || 5000;
listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});