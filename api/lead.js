export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { name, phone, city, concern, details, source } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    const payload = {
      name: name,
      phone: phone,
      display_name: name,
      notes: `Preferred clinic: ${city || 'Not specified'} | Concern: ${concern || 'Not specified'} | Details: ${details || 'Not specified'}`,
      source: source || 'VAMA Landing Page',
      other_fields: {
        city: city || '',
        interest: concern || '',
        details: details || ''
      }
    };

    const response = await fetch(process.env.PRIVYR_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.text();

    if (!response.ok) {
      console.error('Privyr error:', response.status, result);

      return res.status(502).json({
        success: false,
        message: 'Could not send lead to Privyr'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead sent to Privyr'
    });

  } catch (error) {
    console.error('Lead API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}