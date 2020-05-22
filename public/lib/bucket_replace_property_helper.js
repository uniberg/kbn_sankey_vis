/*
 * SourceBucket has the following structure:
 * [
 *    {
 *      col-1-3: "MissinValue1"
 *    },
 *    {
 *      col-2-3: "MissinValue2"
 *    }..
 * DestinationBucket has the following structure:
 *  {
 *    col-1-3: "__missing__"
 *    ...
 *  }
 */
export const bucketReplaceProperty = (sourceBucket, destinationBucket) => {
  for(let bucketArray of sourceBucket) {
    Object.getOwnPropertyNames(bucketArray).forEach( (cell) => {
        if (destinationBucket.hasOwnProperty(cell)) {
          destinationBucket[cell] = bucketArray[cell];
        }
      }
    );
  }
  return destinationBucket;
}
