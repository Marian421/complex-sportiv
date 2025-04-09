// takes an array with all available slots and check for a specific one

const isBooked = (slots, slotId) => {
    const slot = slots.find(s => s.slot_id === slotId); 
    if (slot) {
        return slot.isbooked; 
    }
    return false; 
}

module.exports = isBooked;