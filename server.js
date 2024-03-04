const axios = require('axios');
const fs = require('fs');

// Cloudflare API credentials
const EMAIL = 'armughan@example.com'; // Your Cloudflare account email
const API_KEY = 'hxuhwihc783y8y4fy3789yfi3ruiyfgh843fedd4'; // Your Cloudflare API key
const ZONE_ID = 'hbchwdbicxbciwdbbchbw4848938duh883479'; // Your Cloudflare Zone ID



// Function to fetch all DNS records
async function getAllRecords() {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Auth-Email': EMAIL,
                'X-Auth-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });

        return response.data.result;
    } catch (error) {
        console.error('Error fetching DNS records:', error.message);
        return null;
    }
}

// Function to save records to a JSON file
async function saveRecordsToFile(records) {
    try {
        fs.writeFileSync('dns_records.json', JSON.stringify(records, null, 2));
        console.log('DNS records saved to dns_records.json');
    } catch (error) {
        console.error('Error saving DNS records to file:', error.message);
    }
}

// Function to display records
async function displayRecords() {
    const records = await getAllRecords();
    if (records) {
        console.log('DNS Records:');
        records.forEach(record => {
            console.log(`Type: ${record.type}, Name: ${record.name}, Content: ${record.content}`);
        });
        await saveRecordsToFile(records);
    }
}

// Call the function to display records
displayRecords();
