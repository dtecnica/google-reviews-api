const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/reviews', async (req, res) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = process.env.PLACE_ID;

  try {
    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: PLACE_ID,
          key: GOOGLE_API_KEY,
          fields: 'reviews'
        }
      }
    );

    const reviews = (data.result.reviews || []).filter(
      r => r.rating === 5 && r.text
    );

    res.json(reviews);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao buscar avaliações do Google' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
