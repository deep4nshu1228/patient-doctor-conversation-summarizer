
This is patient-doctor-conversation-summarizer.

To use this go to the client and install libraries using npm i and then start server using npm start.
Then go to the server create .env file where save 
        ASSEMBLYAI_API_KEY = <key>
        HF_API_KEY = <key>

You can get your assemblyai_api_key from "https://www.assemblyai.com/" login and get your api key.
Same you can get you HF_API_KEY from "https://huggingface.co/". Login here go to your account setting->Access Tokens->get new token and paste your token in .env file.

Then using 'npx nodemon app.js' run backend.

And now you can use patient-doctor-converstaion-summarizer.

Record file or upload file from frontend and submit. After few seconds it will generate text from audio and summary of that conversation.

