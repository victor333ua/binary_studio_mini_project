import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { toggleExpandedPost } from '../ExpandedPost/asyncThunks';

const SharedPost = ({ match, toggleExpandedPost: toggle }) => {
  useEffect(() => {
    toggle(match.params.postHash); // action(type:ExpPost, postId)
  });
  return <Redirect to="/" />; // render everything, with extendedPost
};

SharedPost.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  toggleExpandedPost: PropTypes.func.isRequired
};

SharedPost.defaultProps = {
  match: undefined
};

const actions = { toggleExpandedPost };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(SharedPost);
