const express = require('express');
const cors = require('cors');
const axios =  require('axios');
const app = express();
app.use(cors());
app.use(express.json());
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
const fs = require('fs');
require('dotenv/config');


const  { HfInference } = require('@huggingface/inference')
const hf = new HfInference(process.env.HF_API_KEY);

const port = 5000;

app.post('/uploadaudio', upload.single('audioFile'), async (req,res) => {
    // console.log("REQ", req.file);
    let audioFile = req.file;
    console.log("AUDIOFILE---->", audioFile);

    // Retrieve the MP3 file
    const filePath = audioFile.path;
    const fileBuffer = fs.readFileSync(filePath);

    const url = 'https://api.assemblyai.com/v2/upload'
    const headers = {
        "authorization": process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    };

    await axios.post(url, fileBuffer, { headers })
        .then(response => {
            console.log(response.data);
            res.status(200).json({ message: 'Upload successful', data: response.data });
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ message: 'Error' });
        });
})

app.post('/createTranscript', async (req,res) => {
    let audioUrl = req.body.audioUrl;

    const url = 'https://api.assemblyai.com/v2/transcript'
    const data = {
        "audio_url" : audioUrl
    };

    const headers = {
        "authorization": process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    };

    await axios.post(url, data, { headers })
        .then(response => {
            console.log(response.data);
            res.status(200).json({ message: 'Transcription successful', data: response.data });
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ message: 'Error' });
        });
})


app.get('/downloadtranscript', async (req,res) => {
    let id = req.query.id;

    const url = `https://api.assemblyai.com/v2/transcript/${id}`;
    const headers = {
        "authorization": process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    };

    await axios.get(url, { headers })
        .then(async (response) => {
            console.log(response.data);
            res.status(200).json({ message: 'Transcription', data: response.data });
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ message: 'Error' });
        });
})

app.post('/summarize', upload.single('audioFile'), async (req, res) => {

    const text = req.body.text;
    const summary = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: 200
        }
      })

    console.log(summary);
    res.status(200).json({ message: 'Summarize Data', data: summary });

  })

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
