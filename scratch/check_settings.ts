import axios from 'axios';

async function checkSettings() {
  try {
    const response = await axios.get('http://localhost:3001/delivery/settings/global', {
      headers: {
        'x-api-key': 'test-api-key' // I need the actual key from the guide or seed
      }
    });
    console.log('Settings:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error('Error fetching settings:', err.message);
  }
}

checkSettings();
