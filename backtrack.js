function packRooms(pax, rooms, maxRooms = 4, maxAdultsPerRoom = 4) {
    const validPackages = [];
    const seenKeys = new Set();
    const currentCombo = [];

    function backtrack() {
        if (currentCombo.length === pax.length) {
            const key = currentCombo.map(r => `${r.rateKey}|${r.board}|${r.nrf}|${r.capacity.adults}`).sort().join();
            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                validPackages.push(currentCombo.slice());
            }
            return;
        }

        // Constraint: Don't exceed maximum number of rooms
        if (currentCombo.length >= maxRooms) return;

        const paxIndex = currentCombo.length;
        for (const room of rooms) {
            // Constraint: Don't allow rooms with more than maxAdultsPerRoom
            if (room.capacity.adults > maxAdultsPerRoom) continue;

            // Validate room capacity matches pax requirements
            if (room.capacity.adults !== pax[paxIndex].adults) continue;
            // Ensure consistent board and nrf across all rooms in package
            if (currentCombo[0] && (room.board !== currentCombo[0].board || room.nrf !== currentCombo[0].nrf)) continue;
            // Prevent duplicate room usage
            if (currentCombo.includes(room)) continue;

            currentCombo.push(room);
            backtrack();
            currentCombo.pop();
        }
    }

    backtrack();
    return validPackages;
}

module.exports = { packRooms };