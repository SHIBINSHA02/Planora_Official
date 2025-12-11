// backend/utils/scheduleHelper.js

/**
 * Updates a specific slot in a schedule grid and recalculates neighbor workloads.
 * 
 * Logic:
 * - ASSIGN: Set current workload to -1. Increment immediate Left/Right neighbors by 1.
 * - REMOVE: Decrement immediate Left/Right neighbors by 1. Set current slot to null.
 * 
 * @param {Array} grid - The 5x6 schedule array (from Teacher or Classroom)
 * @param {Number} dayIndex - 0 to 4
 * @param {Number} periodIndex - 0 to 5
 * @param {Object|null} slotData - Data to insert, or null to delete
 * @returns {Boolean} true if changes were made
 */
const updateScheduleSlot = (grid, dayIndex, periodIndex, slotData) => {
    // Safety check for bounds
    if (!grid || !grid[dayIndex] || periodIndex < 0 || periodIndex > 5) return false;

    const row = grid[dayIndex];

    // Helper to check if a specific period has an active class assigned
    const isAssigned = (pIndex) => {
        const slot = row[pIndex];
        return Array.isArray(slot) && slot.length > 0;
    };

    const prevIndex = periodIndex - 1;
    const nextIndex = periodIndex + 1;

    // === CASE 1: REMOVING A CLASS ===
    if (!slotData) {
        // Only act if there is actually something to remove
        if (isAssigned(periodIndex)) {
            // Decrement previous neighbor if it exists and is assigned
            if (prevIndex >= 0 && isAssigned(prevIndex)) {
                row[prevIndex][0].workload = (row[prevIndex][0].workload || 0) - 1;
            }

            // Decrement next neighbor if it exists and is assigned
            if (nextIndex <= 5 && isAssigned(nextIndex)) {
                row[nextIndex][0].workload = (row[nextIndex][0].workload || 0) - 1;
            }

            // Clear the actual slot
            row[periodIndex] = null;
            return true;
        }
    }

    // === CASE 2: ASSIGNING A CLASS ===
    else {
        // Create the new slot object with fixed workload -1
        const newSlot = {
            ...slotData,
            workload: -1
        };

        // Increment previous neighbor
        if (prevIndex >= 0 && isAssigned(prevIndex)) {
            row[prevIndex][0].workload = (row[prevIndex][0].workload || 0) + 1;
        }

        // Increment next neighbor
        if (nextIndex <= 5 && isAssigned(nextIndex)) {
            row[nextIndex][0].workload = (row[nextIndex][0].workload || 0) + 1;
        }

        // Assign the new slot (wrapped in array for Schema consistency)
        row[periodIndex] = [newSlot];
        return true;
    }

    return false;
};

module.exports = { updateScheduleSlot };