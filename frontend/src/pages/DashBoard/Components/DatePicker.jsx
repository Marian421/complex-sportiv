import dayjs from "dayjs";

const getNext7Days = () => {
    const dates = [];

    for(let i=0; i <=7; i++) {
        const date = dayjs().add(i, 'days');

        dates.push({
            label: date.format('ddd, MMM D'),
            value: date.format('YYYY-MM-DD')
        })
    }

    return dates;
};

const DatePicker = ({ selectedDate, onChange }) => (
  <select name="date" value={selectedDate} onChange={ (e) => onChange(e.target.value) }>
      {getNext7Days().map((day) => (<option key={day.value} value={day.value}>
          { day.label }
      </option>))}
  </select>

);

export default DatePicker;