const fs = require('fs');
const path = require('path');

/**
 * Trie les chambres pour ordre stable (optionnel, pour signature canonique).
 */
function sortRooms(rooms) {
    return rooms.sort((a, b) => {
        if (a.board !== b.board) return a.board.localeCompare(b.board);
        if (a.nrf !== b.nrf) return a.nrf ? -1 : 1;
        if (a.capacity.adults !== b.capacity.adults) return a.capacity.adults - b.capacity.adults;
        return a.rateKey - b.rateKey;
    });
}

/**
 * Génère toutes les combinaisons valides (permutations + dédup) :
 * - Exact match capacity/adults
 * - Même board et même nrf sur le package
 * - Déduplication quel que soit l'ordre
 * @param {Array} rooms
 * @param {Array} pax
 * @returns {Array[]} Liste de packages valides
 */
function generatePackages(rooms, pax) {
    const result = [];
    const seen = new Set();
    const N = pax.length;
    const used = Array(rooms.length).fill(false);

    function signature(combo) {
        // Canonical signature pour dédup: trier par rateKey + board + nrf + capacity
        return combo
            .map(r => `${r.rateKey}|${r.board}|${r.nrf}|${r.capacity.adults}`)
            .sort()
            .join(',');
    }

    function backtrack(combo) {
        if (combo.length === N) {
            const sig = signature(combo);
            if (!seen.has(sig)) {
                seen.add(sig);
                result.push(combo.slice());
            }
            return;
        }

        const idx = combo.length;
        for (let i = 0; i < rooms.length; i++) {
            if (used[i]) continue;
            const room = rooms[i];
            // 1) capacity exact
            if (room.capacity.adults !== pax[idx].adults) continue;
            // 2) board & nrf
            if (combo.length > 0) {
                const ref = combo[0];
                if (room.board !== ref.board || room.nrf !== ref.nrf) continue;
            }
            // 3) choisir
            used[i] = true;
            combo.push(room);
            backtrack(combo);
            combo.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return result;
}

/**
 * Entrée principale: lecture, tri (optionnel), génération et affichage.
 */
function main() {
    const inputPath = path.resolve(__dirname, 'input.json');
    const { pax, rooms } = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    console.log(`📖 Lecture de ${pax.length} pax et ${rooms.length} rooms`);

    const sortedRooms = sortRooms(rooms);
    console.log('🔀 Rooms triées');

    const packages = generatePackages(sortedRooms, pax);
    console.log(`🎉 Total packages générés: ${packages.length}`);
    console.log(JSON.stringify({ packages }, null, 2));
}

if (require.main === module) {
    main();
}
