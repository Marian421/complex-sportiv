import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function isPastTime(slot_name) {
    const now = dayjs();

    const startTimeStr = slot_name.split(' - ')[0];

    const startTime = dayjs(startTimeStr, 'h:mm A');

    const todayStartTime = dayjs().hour(startTime.hour()).minute(startTime.minute()).second(0);

    return now.isAfter(todayStartTime);
};

export default isPastTime;