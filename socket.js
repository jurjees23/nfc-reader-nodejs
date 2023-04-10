const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { NFC } = require('nfc-pcsc');


io.on('connection', (socket) => {
    console.log('A client has connected');

    // Add NFC reader logic here
    // Create a new instance of the NFC reader
    const nfc = new NFC();

    // Listen for an NFC tag to be scanned
    nfc.on('reader', async (reader) => {
        reader.on('card', async (card) => {

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

                socket.emit('cardScanned', { data: newDataRead.toString() });

            } catch (err) {
                console.log("errr", err)
            }
        })
        reader.on('error', (err) => {
            console.error(err);
        });

        reader.on('end', () => {
            console.log(`${reader.reader.name} device removed`);
        });
    })
    nfc.on('error', err => {
        console.log("err", err)
    });
});

server.listen(5002, () => {
    console.log('Server listening on port 5002');
});