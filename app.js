// hotel-packager.js
const fs = require('fs');
const path = require('path');

/**
 * Génère toutes les combinaisons de taille N dans un tableau (backtracking).
 * @param {Array} arr  - Le tableau d'éléments
 * @param {number} N  - Taille des combinaisons à générer
 * @returns {Array[]} - Liste de combinaisons (tableaux de N éléments)
 */
function combinations(arr, N) {
    const result = [];
    function backtrack(start, combo) {
        if (combo.length === N) {
            result.push(combo.slice());
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            backtrack(i + 1, combo);
            combo.pop();
        }
    }
    backtrack(0, []);
    return result;
}

/**
 * Lit input.json, construit les packages, et les affiche au format JSON.
 */
function main() {
    const inputPath = path.resolve(__dirname, 'input.json');
    const { pax, rooms } = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const numRoomsNeeded = pax.length;

    // 1) Grouper par clé composite board|nrf
    const byGroup = rooms.reduce((acc, room) => {
        const key = `${room.board}|${room.nrf}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(room);
        return acc;
    }, {});

    // 2) Pour chaque groupe, générer & filtrer
    const packages = [];
    for (const roomList of Object.values(byGroup)) {
        const allCombos = combinations(roomList, numRoomsNeeded);
        allCombos.forEach(combo => {
            const ok = combo.every((room, idx) =>
                room.capacity.adults >= pax[idx].adults
            );
            if (ok) packages.push(combo);
        });
    }

    // 3) Afficher le résultat
    console.log(JSON.stringify({ packages }, null, 2));
}

if (require.main === module) {
    main();
}
