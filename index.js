const NodeClam = require('clamscan');

const ClamScan = new NodeClam().init({
    debug_mode: false,
    clamdscan: {
        host: '127.0.0.1', // If you want to connect locally but not through socket
        port: 3310, // Because, why not
        timeout: 300000, // 5 minutes
        local_fallback: false, // Use local preferred binary to scan if socket/tcp fails
    },
});


// Get instance by resolving ClamScan promise object
ClamScan.then(async clamscan => {
    try {
        // You can re-use the `clamscan` object as many times as you want
        const version = await clamscan.get_version();
        console.log(`-- ClamAV Version:`, version);

        const { is_infected, file, viruses } = await clamscan.is_infected('./01_danger.txt');
        if (is_infected) {
            console.log(`${file} is infected with ${viruses}!`);
        } else {
            console.log('danger.txt is not infected');
        }

        const result = await clamscan.is_infected('./02_safe.txt');

        if (result.is_infected) {
            console.log(`safe.txt is infected with ${result.viruses}!`);
        } else {
            console.log('safe.txt is not infected');
        }
    } catch (err) {
        // Handle any errors raised by the code in the try block

        console.log('Something went wrong while scanning files', err);
    }
}).catch(err => {
    // Handle errors that may have occurred during initialization
    console.log('Something went wrong during initialization', err);
});