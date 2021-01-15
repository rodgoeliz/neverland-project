export default (objectOrId) => {
  if (typeof objectOrId === "string") {
    return objectOrId;
  } 
  
  if (typeof objectOrId === "object") {
    return objectOrId._id;
  }
  return objectOrId;
}
