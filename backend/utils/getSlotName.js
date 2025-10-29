const getSlotName = (slots, slotId) => {
  const slot = slots.find((s) => s.slot_id === parseInt(slotId, 10));

  if (slot) {
    return slot.slot_name;
  }

  return false;
};

module.exports = getSlotName;
