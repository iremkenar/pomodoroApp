export const getNow = () => {
  return new Date();
};

/* istanbul ignore next */
export const getTimeRemaining = (endtime) => {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return {
    total,
    minutes,
    seconds,
  };
};

export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};
