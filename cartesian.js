function packRooms(pax, rooms, maxRooms = 4, maxAdultsPerRoom = 4) {
    if (pax.length > maxRooms) return [];

    // Group rooms by board+nrf first
    const groups = new Map();

    for (const room of rooms) {
        if (room.capacity.adults > maxAdultsPerRoom) continue;

        const key = `${room.board}|${room.nrf}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(room);
    }

    const result = [];
    const seenKeys = new Set();

    // Try each board+nrf combination
    for (const roomGroup of groups.values()) {
        const roomSets = pax.map(p =>
            roomGroup.filter(r => r.capacity.adults === p.adults)
        );

        // Skip if any passenger can't be satisfied
        if (roomSets.some(set => set.length === 0)) continue;

        // Generate cartesian product
        const products = cartesianProduct(roomSets);

        // Filter valid combinations (no duplicate rooms) and deduplicate
        for (const combo of products) {
            const rateKeys = combo.map(r => r.rateKey);

            // Check no duplicate rooms in this combo
            if (new Set(rateKeys).size !== rateKeys.length) continue;

            // Create consistent key for deduplication
            const key = combo.map(r => `${r.rateKey}|${r.board}|${r.nrf}|${r.capacity.adults}`).sort().join();

            if (!seenKeys.has(key)) {
                seenKeys.add(key);
                result.push(combo);
            }
        }
    }

    return result;
}

function cartesianProduct(arrays) {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(x => [x]);

    const [first, ...rest] = arrays;
    const restProduct = cartesianProduct(rest);

    return first.flatMap(x =>
        restProduct.map(combo => [x, ...combo])
    );
}

module.exports = { packRooms };
