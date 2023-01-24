/* Helper function to enable PATCH method */
const updateFields = (fields) => {
  // declare props for obejct to return
  const set = [],
    values = [];
  // reserve $1 for ID of updating record
  let param = 2;

  // compose SET part of query string
  for (let field in fields) {
    if (fields.hasOwnProperty(field)) {
      set.push(`${field} = $${param}`);
      values.push(fields[field]);
      param++;
    }
  }

  // return object with 'set' => the fields to SET, and
  // corresponding 'values' for the UPDATE query string
  return {
    set: set.join(", "),
    values: values,
  };
};

module.exports = updateFields;
