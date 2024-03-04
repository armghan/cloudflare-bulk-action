require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Cloudflare API credentials
const EMAIL = process.env.CLOUDFLARE_EMAIL;
const API_KEY = process.env.CLOUDFLARE_API_KEY;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

// Function to read DNS records from JSON file
function readRecordsFromFile() {
    try {
        const data = fs.readFileSync('dns_records.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DNS records from file:', error.message);
        return null;
    }
}

// Function to delete a DNS record
async function deleteRecord(record) {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${record.id}`;

    try {
        await axios.delete(url, {
            headers: {
                'X-Auth-Email': EMAIL,
                'X-Auth-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Deleted record: ${record.type}, Name: ${record.name}, Content: ${record.content}`);
    } catch (error) {
        console.error(`Error deleting record ${record.id}:`, error.message);
    }
}

// Main function to delete DNS records
async function deleteRecords() {
    const records = readRecordsFromFile();
    if (!records) {
        return;
    }

    for (const record of records) {
        await deleteRecord(record);
    }
}

// Execute the main function
deleteRecords();
