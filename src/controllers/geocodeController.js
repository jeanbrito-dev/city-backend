// Reverse geocode controller — converte lat/lon em endereço legível
// usando a API do Nominatim (OpenStreetMap)

export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Parâmetros 'lat' e 'lon' são obrigatórios" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "Unicity/1.0 (unicity@gmail.com)",
        },
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Erro ao consultar serviço de geocodificação" });
    }

    const geo = await response.json();
    const addr = geo.address || {};

    const parts = [addr.road, addr.suburb, addr.city || addr.town].filter(Boolean);
    const endereco = parts.join(", ") || "Local não encontrado";

    res.json({ endereco, raw: addr });
  } catch (err) {
    console.error("Erro no reverse geocode:", err);
    res.status(500).json({ error: "Erro interno ao buscar endereço" });
  }
};

// geocodeController.js

export const searchAddress = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`,
      {
        headers: {
          "User-Agent": "Unicity/1.0 (unicity@gmail.com)",
        },
      },
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar endereço",
    });
  }
};