export const verifyDateChange = (today, yesterday) => {
  return (today.getDate() - yesterday.getDate()) !== 0
  || today.getMonth() !== yesterday.getMonth()
  || today.getFullYear() !== yesterday.getFullYear()
};

export const calculateDday = (firstMeetDay) => {
  const nowDate = new Date();
  const gap = nowDate.getTime() - firstMeetDay.getTime();

  return Math.floor(gap / (1000 * 60 * 60 * 24));
};

export const createImageForm = (profileImageUri) => {
  const localUri = profileImageUri;
  const filename = localUri.split('/').pop();

  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const imgFormData = new FormData();
  imgFormData.append('profile_image_url', {
    uri: localUri,
    name: filename,
    type
  });

  return imgFormData;
};
