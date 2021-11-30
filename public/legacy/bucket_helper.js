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
export const bucketHelper = (response, bucket) => {
  return(response.columns.find( column =>
    column.meta.field !== (bucket.meta.field)));
};
