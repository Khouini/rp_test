const fs = require('fs');
const path = require('path');

// Génère et affiche les packages valides
function main() {
    const startTime = Date.now();
    const { pax, rooms } = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'input2.json'), 'utf8'));
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

            // funciton ValidateByPax()
            // pax ocmparison
            if (room.capacity.adults !== pax[paxIndex].adults) continue; //room.ad
            // fixedPax = MalePax(room.rates[0])
            // if fixedPax.adults !== pax[paxIndex].adults) || fixedPax.children !== pax[paxIndex].children) || fixedPax.infants !== pax[paxIndex].infants) continue;
            // check children ages
            // for (let i = 0; i < room.children.length; i++) {
            //     if (room.children[i] !== pax[paxIndex].children[i]) continue;
            // }
            //}

            // funciton ValidateByRoomCombo()
            // current combo comparison
            if (currentCombo[0] && (room.board !== currentCombo[0].board || room.nrf !== currentCombo[0].nrf)) continue;
            // if (currentCombo[0].availalbity !== room.availability) continue;
            // check view
            // for (const view of room.view) {
            // for (const currentView of currentCombo[0].view) {
            //     if (view !== currentView) continue;
            // }
            // }
            // check room type
            // if (currentCombo[0].roomType !== room.roomType) continue;
            if (currentCombo.includes(room)) continue;
            currentCombo.push(room);
            backtrack();
            currentCombo.pop();
        }
    }

    backtrack();
    console.log(`Found ${validPackages.length} valid packages in ${Date.now() - startTime} ms`);
    console.log(JSON.stringify({ packages: validPackages }, null, 2));
}

main();
