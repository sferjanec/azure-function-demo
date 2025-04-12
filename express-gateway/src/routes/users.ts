import express from 'express';
import axios from 'axios';

const router = express.Router();

const FUNCTION_URL = 'https://my-azure-function-getusers-dev.azurewebsites.net/api/getusers';

router.get('/users', async (req, res) => {
  try {
    const response = await axios.get(FUNCTION_URL);
    res.status(200).json(response.data);
  } catch (err: any) {
    console.error('Error calling Azure Function:', err.message);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

export default router;
