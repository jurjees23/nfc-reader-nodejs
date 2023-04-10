const { NFC } = require('nfc-pcsc');

// Create a new instance of the NFC reader
const nfc = new NFC();

// Listen for an NFC tag to be scanned
nfc.on('reader', async (reader) => {
    console.log("reader", reader)
    console.log(`${reader.reader.name}  device attached`);

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

            // Read the data back to verify
            const newDataRead = await reader.read(blockNumber, 16);
            console.log(`Data read:`, newDataRead.toString());

        } catch (err) {
            console.log("errr", err)
        }



    });

    reader.on('error', (err) => {
        console.error(err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name} device removed`);
    });
});
