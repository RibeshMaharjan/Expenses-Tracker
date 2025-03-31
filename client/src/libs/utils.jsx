import NepaliDate from 'nepali-datetime';

// FORMAT DATE TIME
export const formatDateTime = (transactionDate, transactionTime) => {
  const date = new Date(transactionDate.split("T")[0].concat("T" + transactionTime + ".000Z"));
  const nepaliDate = new NepaliDate(date);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); // English weekday

  const dayOfMonth = nepaliDate.getDate();
  const hour = transactionTime.split(":")[0];
  const minute = transactionTime.split(":")[1];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;

  const englishMonths = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
  ];

  const monthIndex = nepaliDate.getMonth();
  const monthName = englishMonths[monthIndex];

  const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${formattedHour}:${minute} ${ampm}`;

  return (formattedDate);
};