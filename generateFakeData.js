const fs = require('fs');
const path = require('path');

function generateFakeData(numRooms) {
    const roomNames = [
        "Chambre Simple",
        "Chambre Double Vue Piscine",
        "Chambre Double Vue Jardin",
        "Suite Familiale",
        "Appartement Deluxe",
        "Studio Confort",
        "Penthouse Vue Mer",
        "Chambre Twin",
        "Chambre Supérieure",
        "Loft Design"
    ];

    const boards = ["BR", "RO", "BB", "AI"];

    const pax = Array.from({ length: 4 }, () => ({
        adults: Math.floor(Math.random() * 4) + 1
    }));

    const rooms = [];
    for (let i = 0; i < numRooms; i++) {
        const roomName = roomNames[i % roomNames.length];
        const board = boards[i % boards.length];
        const nrf = Math.random() < 0.5;
        const capacity = Math.floor(Math.random() * 4) + 1;
        const rateKey = i + 1;

        rooms.push({
            roomName,
            board,
            nrf,
            rateKey,
            capacity: { adults: capacity }
        });
    }

    return {
        pax,
        rooms
    };
}

if (require.main === module) {
    const numRooms = parseInt(process.argv[2], 10) || 10;
    const fakeData = generateFakeData(numRooms);

    const fileName = `input_${numRooms}_rooms.json`;
    const filePath = path.resolve(__dirname, fileName);

    fs.writeFileSync(filePath, JSON.stringify(fakeData, null, 2), 'utf-8');
    console.log(`Fake data for ${numRooms} rooms saved to ${fileName}`);
}

module.exports = generateFakeData;
