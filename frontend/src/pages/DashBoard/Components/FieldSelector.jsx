const FieldSelector = ({ fields, value, onChange }) => (
  <select value={value} name="field" onChange={(e) => onChange(e.target.value)}>
    {fields.map((field) => (
      <option key={field.id} value={field.id}>
        {`${field.name} (${field.price_per_hour} lei)`}
      </option>
    ))}
  </select>
);

export default FieldSelector;
