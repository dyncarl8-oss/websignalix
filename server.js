import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Endpoint to create Polar Checkout
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { customerEmail, userId } = req.body;
    
    // In production, use environment variables for these
    const polarToken = 'polar_oat_dLVG0vuHzeUHjBlNpP5kM6cacxK9PW0iq7yHX2DVu9S';
    const productId = '19c116dd-58c2-4df0-8904-c1cb6d617e95';
    
    // Determine the base URL for the success redirect
    // 1. Prefer explicitly set BASE_URL env var (Best for Render)
    // 2. Fallback to Request Origin header
    // 3. Fallback to constructing from host header (Render uses x-forwarded-proto)
    let origin = process.env.BASE_URL;
    
    if (!origin) {
      if (req.headers.origin) {
        origin = req.headers.origin;
      } else {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        origin = `${protocol}://${host}`;
      }
    }

    // Call Polar Sandbox API
    const response = await fetch('https://sandbox-api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${origin}?payment=success`,
        customer_email: customerEmail,
        metadata: {
          userId: userId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to create checkout' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});