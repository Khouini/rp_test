// Extract the core logic from app.js for testing
// const { packRooms } = require('../backtrack');
const { packRooms } = require('../cartesian');


describe('PackRooms Tests', () => {

    describe('Basic Functionality', () => {
        test('should pack single adult into single room', () => {
            const pax = [{ adults: 1 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(1);
            expect(result[0][0].rateKey).toBe('R1');
        });

        test('should pack two adults into appropriate rooms', () => {
            const pax = [{ adults: 2 }, { adults: 1 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(2);
        });
    });

    describe('Max 4 Rooms Constraint', () => {
        test('should handle exactly 4 rooms with 1 adult each', () => {
            const pax = [
                { adults: 1 },
                { adults: 1 },
                { adults: 1 },
                { adults: 1 }
            ];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R3', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R4', board: 'BB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
        });

        test('should handle 4 rooms with varying adult counts', () => {
            const pax = [
                { adults: 2 },
                { adults: 3 },
                { adults: 1 },
                { adults: 4 }
            ];
            const rooms = [
                { rateKey: 'R1', board: 'HB', nrf: true, capacity: { adults: 2 } },
                { rateKey: 'R2', board: 'HB', nrf: true, capacity: { adults: 3 } },
                { rateKey: 'R3', board: 'HB', nrf: true, capacity: { adults: 1 } },
                { rateKey: 'R4', board: 'HB', nrf: true, capacity: { adults: 4 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
        });

        test('should not exceed 4 rooms limit', () => {
            const pax = [
                { adults: 1 },
                { adults: 1 },
                { adults: 1 },
                { adults: 1 },
                { adults: 1 } // 5th room needed
            ];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R3', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R4', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R5', board: 'BB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0); // No valid packages since more than 4 rooms needed
        });
    });

    describe('Max 4 Adults Per Room Constraint', () => {
        test('should handle room with exactly 4 adults', () => {
            const pax = [{ adults: 4 }];
            const rooms = [
                { rateKey: 'R1', board: 'FB', nrf: false, capacity: { adults: 4 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0][0].capacity.adults).toBe(4);
        });

        test('should reject rooms with more than 4 adults', () => {
            const pax = [{ adults: 5 }]; // Exceeds max capacity
            const rooms = [
                { rateKey: 'R1', board: 'FB', nrf: false, capacity: { adults: 5 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0); // No match since 5 > 4
        });

        test('should handle multiple rooms each with 4 adults', () => {
            const pax = [
                { adults: 4 },
                { adults: 4 }
            ];
            const rooms = [
                { rateKey: 'R1', board: 'AI', nrf: true, capacity: { adults: 4 } },
                { rateKey: 'R2', board: 'AI', nrf: true, capacity: { adults: 4 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(2);
            expect(result[0].every(room => room.capacity.adults === 4)).toBe(true);
        });
    });

    describe('Board and NRF Consistency', () => {
        test('should group rooms with same board type', () => {
            const pax = [{ adults: 1 }, { adults: 2 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R3', board: 'HB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0].every(room => room.board === 'BB')).toBe(true);
        });

        test('should not mix different board types', () => {
            const pax = [{ adults: 1 }, { adults: 1 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'HB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0); // No valid packages with mixed board types
        });

        test('should respect NRF consistency', () => {
            const pax = [{ adults: 1 }, { adults: 1 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: true, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 1 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0); // No valid packages with mixed NRF
        });
    });

    describe('Complex Scenarios', () => {
        test('should handle multiple valid combinations', () => {
            const pax = [{ adults: 2 }, { adults: 2 }];
            const rooms = [
                { rateKey: 'R1A', board: 'BB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R1B', board: 'BB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R2A', board: 'HB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R2B', board: 'HB', nrf: false, capacity: { adults: 2 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(2); // Two valid combinations (BB and HB)
        });

        test('should handle edge case with maximum configuration', () => {
            const pax = [
                { adults: 4 },
                { adults: 4 },
                { adults: 4 },
                { adults: 4 }
            ];
            const rooms = [
                { rateKey: 'R1', board: 'AI', nrf: true, capacity: { adults: 4 } },
                { rateKey: 'R2', board: 'AI', nrf: true, capacity: { adults: 4 } },
                { rateKey: 'R3', board: 'AI', nrf: true, capacity: { adults: 4 } },
                { rateKey: 'R4', board: 'AI', nrf: true, capacity: { adults: 4 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
            expect(result[0].reduce((sum, room) => sum + room.capacity.adults, 0)).toBe(16);
        });

        test('should handle no available rooms scenario', () => {
            const pax = [{ adults: 2 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'BB', nrf: false, capacity: { adults: 3 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0);
        });

        test('should prevent duplicate room usage', () => {
            const pax = [{ adults: 2 }, { adults: 2 }];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 2 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0); // Cannot use same room twice
        });

        test('should handle mixed adult counts within limits', () => {
            const pax = [
                { adults: 1 },
                { adults: 2 },
                { adults: 3 },
                { adults: 4 }
            ];
            const rooms = [
                { rateKey: 'R1', board: 'FB', nrf: false, capacity: { adults: 1 } },
                { rateKey: 'R2', board: 'FB', nrf: false, capacity: { adults: 2 } },
                { rateKey: 'R3', board: 'FB', nrf: false, capacity: { adults: 3 } },
                { rateKey: 'R4', board: 'FB', nrf: false, capacity: { adults: 4 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
            expect(result[0].map(r => r.capacity.adults).sort()).toEqual([1, 2, 3, 4]);
        });
    });

    describe('Performance and Edge Cases', () => {
        test('should handle empty pax array', () => {
            const pax = [];
            const rooms = [
                { rateKey: 'R1', board: 'BB', nrf: false, capacity: { adults: 2 } }
            ];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(0);
        });

        test('should handle empty rooms array', () => {
            const pax = [{ adults: 2 }];
            const rooms = [];

            const result = packRooms(pax, rooms);

            expect(result).toHaveLength(0);
        });

        test('should handle large number of room options efficiently', () => {
            const pax = [{ adults: 2 }, { adults: 1 }];
            const rooms = [];

            // Create 20 rooms of each type to test performance
            for (let i = 1; i <= 20; i++) {
                rooms.push({
                    rateKey: `R2-${i}`,
                    board: 'BB',
                    nrf: false,
                    capacity: { adults: 2 }
                });
                rooms.push({
                    rateKey: `R1-${i}`,
                    board: 'BB',
                    nrf: false,
                    capacity: { adults: 1 }
                });
            }

            const startTime = Date.now();
            const result = packRooms(pax, rooms);
            const duration = Date.now() - startTime;

            expect(result.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});