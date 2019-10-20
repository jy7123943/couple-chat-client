export const calculateDday = (firstMeetDay) => {
  const nowDate = new Date();
  const gap = nowDate.getTime() - firstMeetDay.getTime();
  return Math.floor(gap / (1000 * 60 * 60 * 24));
};
