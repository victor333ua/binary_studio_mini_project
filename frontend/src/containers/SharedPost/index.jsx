import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleExpandedPost } from '../ExpandedPost/asyncThunks';

const SharedPost = ({ match }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleExpandedPost(match.params.postHash)); // action(type:ExpPost, postId)
  });
  return <Redirect to="/" />; // render everything, with extendedPost
};
SharedPost.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired
};
export default SharedPost;
