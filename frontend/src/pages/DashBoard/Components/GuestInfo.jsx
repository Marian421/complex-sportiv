const GuestInfo = ({ formData, onChange }) => (
  <>
    <input
      type="text"
      name="guest_name"
      placeholder="Guest name"
      value={formData.guest_name}
      onChange={onChange}
    />
    <input
      type="tel"
      name="guest_phone"
      placeholder="Guest phone number"
      value={formData.guest_phone}
      onChange={onChange}
    />
  </>
);

export default GuestInfo;
