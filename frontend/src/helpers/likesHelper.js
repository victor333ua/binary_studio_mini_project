export const addLike = (elemToAddLike, isLike, isNewRecord) => {
  let diff = 1;
  if (isNewRecord == null) diff = -1;
  const reactions = isLike ? ['likeCount', 'dislikeCount'] : ['dislikeCount', 'likeCount'];
  // if double usage reaction - delete record - decrease counter (response - null)
  // if new record in db - increase counter for first elem in array (isNewRecord - true)
  // if for existing record in db we change reaction - increase first & decrease second (isNewRecord - false)

  const newState = {
    ...elemToAddLike,
    [reactions[0]]: Number(elemToAddLike[reactions[0]]) + diff
  };
  if (isNewRecord === false) {
    newState[reactions[1]] = Number(elemToAddLike[reactions[1]]) - 1;
  }
  return newState;
};
