const SlotSelector = ({ slots, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {slots
      .filter((slot) => !slot.isbooked)
      .map((slot) => (
        <option key={slot.slot_id} value={slot.slot_id}>
          {slot.slot_name}
        </option>
      ))}
  </select>
);

export default SlotSelector;
