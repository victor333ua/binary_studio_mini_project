export const addLike = (elemToAddLike, isLike, isNewRecord, currentUser) => {
  // if double usage reaction - delete record - decrease counter (isNewRecord - null)
  // if new record in db - increase counter for first elem in reactions (isNewRecord - true)
  // if for existing record in db we change reaction - increase first & decrease second (isNewRecord - false)

  let diff = 1;
  const updatedReactions = [...elemToAddLike.reactions];
  if (isNewRecord == null) diff = -1;
  if (isNewRecord != null) updatedReactions.push({ user: currentUser, isLike });
  if (isNewRecord === false || isNewRecord == null) {
    const index = updatedReactions.findIndex(e => e.user.id === currentUser.id);
    updatedReactions.splice(index, 1);
  }

  const counts = isLike ? ['likeCount', 'dislikeCount'] : ['dislikeCount', 'likeCount'];

  const newState = {
    ...elemToAddLike,
    [counts[0]]: Number(elemToAddLike[counts[0]]) + diff,
    reactions: updatedReactions
  };
  if (isNewRecord === false) {
    newState[counts[1]] = Number(elemToAddLike[counts[1]]) - 1;
  }
  return newState;
};
