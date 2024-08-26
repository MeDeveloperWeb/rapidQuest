export const getFormattedDates = (data, ...fields) => {
  const formattedData = {};

  fields.forEach((field) => {
    formattedData[field] = new Date(data[field]).toISOString();
  });

  return {
    ...data,
    ...formattedData,
  };
};
