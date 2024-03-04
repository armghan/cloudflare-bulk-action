require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Read Cloudflare API credentials from environment variables
const EMAIL = process.env.CLOUDFLARE_EMAIL;
const API_KEY = process.env.CLOUDFLARE_API_KEY;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

// Function to fetch all DNS records
async function getAllRecords() {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`;

    let page = 1;
    const perPage = 100; // Maximum records per page
    let allRecords = [];

    try {
        while (true) {
            const response = await axios.get(url, {
                params: {
                    page: page,
                    per_page: perPage,
                },
                headers: {
                    'X-Auth-Email': EMAIL,
                    'X-Auth-Key': API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            const records = response.data.result;
            allRecords = allRecords.concat(records);

            // If the number of records fetched is less than the maximum per page, we've reached the end
            if (records.length < perPage) {
                break;
            }

            page++;
        }

        return allRecords;
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
