const express = require('express');
const app = express();
const fs = require('fs');
const port = 3001;
const https = require('https');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const formData = require('express-form-data');
const os = require("os");

app.use(cors());
app.use(formData.parse({
    uploadDir: os.tmpdir(),
    autoClean: true
}));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

// Create an HTTPS agent with keep-alive enabled
const agent = new https.Agent({keepAlive: true});

app.post('/api/getData', async (req, res) => {

    let user_id = req.body.user_id;
    let token = req.body.token;

    if (user_id === '' || user_id == null) {
        return res.status(400).json({
            status: false,
            message: "User Id is required"
        });
    }
    if (token === '' || token == null) {
        return res.status(400).json({
            status: false,
            message: "Auth token is required"
        });
    }

    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://cloud.leonardo.ai/api/rest/v1/generations/user/'+ user_id +'?offset=0&limit=10',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer '+ token +''
            }
        };

        const response = await axios.request(config);
        const data = response.data;
        if (data.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No record found"
            });
        }
        const imageUrl = data['generations'][0]['generated_images'][0]['url'];

        // Download Image From URL
        https.get(imageUrl, (response) => { // Use 'https.get' for secure URLs
            const imageName = path.basename(imageUrl);
            const imagePath = path.join(__dirname, 'downloads', imageName);
            const fileStream = fs.createWriteStream(imagePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                res.json({success: true, message: 'Image downloaded successfully'});
            });
            response.on('error', (err) => {
                fs.unlinkSync(imagePath);
                res.status(500).json({success: false, error: `Error downloading image: ${err.message}`});
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});