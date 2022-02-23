export const bucketReplaceProperty = (sourceBucket, destinationBucket, cell) => {
  // userDefinedArrayLabels stores the defined 'other' or 'missing' values defined by the user when he checks
  // 'Group other values' or 'Show missing values'
  const userDefinedArrayLabels = sourceBucket.find(element => element.hasOwnProperty(cell));
  destinationBucket[cell] = userDefinedArrayLabels[cell];
  return destinationBucket;
};
