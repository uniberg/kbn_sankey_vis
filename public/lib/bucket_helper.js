/*
 * The idea is to populate 'otherBucket' array and 'missingBucket' with the correct id of the resp.column
 * if the label for other/missing bucket is defined.
 * resp.columns has the following structure:
 * [
 *  {
 *     id: "col-0-2", name: "ip: Descending"
 *  }
 *  ...
 * ]
*/
export const bucketHelper = (response, bucket, label) => {
  let tmpArr = [];
  response.columns.find( column => {
    if ((column.name.search(bucket.params.field.name) !== -1)) {
      tmpArr.push({[column.id]: label});
    }
  })
  return tmpArr;
}
