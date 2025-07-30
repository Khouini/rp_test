const fs = require('fs');
const path = require('path');

// Génère et affiche les packages valides
function main() {
    const { pax, rooms } = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'input.json'), 'utf8'));
    const validPackages = [], seenKeys = new Set(), currentCombo = [];

    function backtrack() {
        if (currentCombo.length === pax.length) {
            const key = currentCombo.map(r => `${r.rateKey}|${r.board}|${r.nrf}|${r.capacity.adults}`).sort().join();
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                validPackages.push(currentCombo.slice());
            }
            return;
        }
        const paxIndex = currentCombo.length;
        for (const room of rooms) {
            if (room.capacity.adults !== pax[paxIndex].adults) continue;
            if (currentCombo[0] && (room.board !== currentCombo[0].board || room.nrf !== currentCombo[0].nrf)) continue;
            if (currentCombo.includes(room)) continue;
            currentCombo.push(room);
            backtrack();
            currentCombo.pop();
        }
    }

    backtrack();
    console.log(JSON.stringify({ packages: validPackages }, null, 2));
}

main();
