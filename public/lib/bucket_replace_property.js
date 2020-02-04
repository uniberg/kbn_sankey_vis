export function bucketReplaceProperty(sourceBucket, destinationBucket) {
  for(var key of sourceBucket) {
    Object.getOwnPropertyNames(key).forEach(
      function (val, idx, array) {
        if(destinationBucket.hasOwnProperty(val)){
          destinationBucket[val] = key[val];
        }
      }
    );
  }
  return destinationBucket;
}
