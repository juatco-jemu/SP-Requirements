import { Timestamp } from "firebase/firestore";
import { parse } from "uuid";

export const dateTodayGenerator = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

export const formattedDate = () => {
  const dateToday = dateTodayGenerator();
  const month = padZero(dateToday.month);
  const day = padZero(dateToday.day);

  return `${dateToday.year}-${month}-${day}`;
};

export const formattedQueueNumber = () => {
  const dateToday = dateTodayGenerator();
  const month = padZero(dateToday.month);
  const day = padZero(dateToday.day);

  return `${month}${day}`;
};

export const formattedDisplayDateToday = () => {
  const dateToday = dateTodayGenerator();
  const month = padZero(dateToday.month);
  const day = padZero(dateToday.day);

  return `${month}/${day}/${dateToday.year}`;
};
const padZero = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formattedDateTodayStringShort = () => {
  const dateToday = new Date();
  return dateToday.toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric" });
};

export const formattedDateTodayStringLong = () => {
  const dateToday = new Date();
  return dateToday.toLocaleString("en-PH", { year: "numeric", month: "long", day: "numeric" });
};

export const formatMoney = (amount: number | string) => {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return parsedAmount.toLocaleString("en-PH", { style: "currency", currency: "PHP" }).replace("₱", "");
};

export const formatTimestamp = (timestamp: Timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString("en-PH", options);
};

export const formatTimeStampToQueueDateFormat = (timestamp: Timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const year = padZero(date.getFullYear());
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return `${year}-${month}-${day}`;
};
