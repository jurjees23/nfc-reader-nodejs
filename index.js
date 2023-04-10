const { NFC } = require('nfc-pcsc');

const express = require('express');
const app = express();
const port = 3000;

app.get('/nfc', (req, res) => {
    // Create a new instance of the NFC reader
    const nfc = new NFC();

    // Listen for an NFC tag to be scanned
    nfc.on('reader', async (reader) => {


        console.log(`${reader.reader.name}  device attached`);
        //set the appropriate HTTP header
        res.setHeader('Content-Type', 'text/html');
        res.write(`<h1>${reader.reader.name}  device attached</h1>`)

        res.write(`<h1>Tap Your Card</h1>`)
        // Listen for an NFC tag to be scanned
        reader.on('card', async (card) => {
            // Get the tag ID
            const tagId = card.uid.toString('hex');

            // Get the data you want to write to the database
            const value = card.atr.toString('utf8');

            try {
                const blockNumber = 4;
                const newData = 'MEDAWATAR-1001';
                const buffer = Buffer.alloc(16, 0);
                buffer.write(newData, 0, newData.length);
                await reader.write(blockNumber, buffer);
                console.log(`Data written:`, buffer.toString());
                res.write(`<h1>Data written: ${buffer.toString()}</h1>`)


                // Read the data back to verify
                const newDataRead = await reader.read(blockNumber, 16);
                console.log(`Data read:`, newDataRead.toString());
                res.write(`<h1>Data Readed ${newDataRead.toString()}</h1>`)

                res.end()


            } catch (err) {
                console.log("errr", err)
            }



        });

        reader.on('error', (err) => {
            res.send(`Reader Not Attached`)
            console.error(err);
        });

        reader.on('end', () => {
            console.log(`${reader.reader.name} device removed`);
        });
    });
    nfc.on('error', err => {
        res.send(`Reader Not Attached`)
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


