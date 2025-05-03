import dayjs from "dayjs";

const formatDate = (date) => {
    return dayjs(date).format('DD-MM-YYYY');
}

export default formatDate;