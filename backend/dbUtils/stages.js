export const matchDateRange = (start, end, field = "created_at") => ({
  $match: {
    [field]: {
      $gte: start,
      $lte: end,
    },
  },
});

export const projectFormattedDate = (
  dateField,
  newDateField,
  additionalFields = {}
) => ({
  $project: {
    ...additionalFields,

    [newDateField]: {
      $dateFromString: { dateString: `$${dateField}` },
    },
  },
});

export const groupByInterval = (interval, dateField, fields = {}) => ({
  $group: {
    _id: {
      [interval]: { [`$${interval}`]: `$${dateField}` },
    },
    ...fields,
  },
});

export const sortBy = (field) => ({
  $sort: { [field]: 1 },
});
