const convertToSolarDate = (time: Date) => {
  const date = new Date(time);

  const text = `${date.toLocaleDateString("fa", {
    weekday: "long",
  })} , ${date.toLocaleDateString("fa", {
    day: "numeric",
  })} ${date.toLocaleDateString("fa", {
    month: "long",
  })} ${date.toLocaleDateString("fa", { year: "numeric" })}`;

  return text;
};

interface SelectedDayType {
  month: number;
  year: number;
  day: number;
}

const changeToFormatString = (selectedDay: SelectedDayType) => {
  const date = new Date(
    `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}`
  );

  let formatDate = `${date.getFullYear()}/`;

  if (date.getMonth() + 1 <= 9) {
    formatDate += `0${date.getMonth() + 1}/`;
  } else {
    formatDate += `${date.getMonth() + 1}/`;
  }

  if (date.getDate() <= 9) {
    formatDate += `0${date.getDate()}`;
  } else {
    formatDate += `${date.getDate()}`;
  }

  return formatDate;
};

export { convertToSolarDate, changeToFormatString };
