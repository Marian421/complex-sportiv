const getSlotName = (slots, slotId) => {
    const slot = slots.find(s => slot_id === slotId);

    if (slot) {
        return slot.slot_name;
    } 

    return false;
}

module.exports = getSlotName;