const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isThisYear = (date) => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
};

// helper function to render thread date
// returns only the time if the date is today, otherwise returns the date
export const renderDate = (threadDate) => {
  let date = new Date(threadDate);
  if (isToday(date)) {
    return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (isThisYear(date)) {
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    }); //
  } else return date.toLocaleDateString();
};
