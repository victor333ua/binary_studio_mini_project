import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header, Message } from 'semantic-ui-react';
import moment from 'moment';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import { likePost, deletePost, updatePost } from '../Thread/asyncThunks';
import { toggleExpandedPost, addComment } from './asyncThunks';
import { GUEST } from '../../scenes/rolesConstants';
import { ModalNotAllowed } from '../../components/ModalNotAllowed';
import { postsResetError } from '../Thread/slice';

const ExpandedPost = ({
  user: currentUser,
  post,
  likePost: like,
  toggleExpandedPost: toggle,
  deletePost: cut,
  updatePost: update,
  addComment: add,
  error,
  postsResetError: resetErr
}) => {
  let sortedComments = [];
  if (post.comments) {
    sortedComments = [...post.comments];
    sortedComments = sortedComments
      .sort((c1, c2) => moment(c1.createdAt).diff(moment(c2.createdAt)))
      .map(comment => (
        <Comment
          key={comment.id}
          user={currentUser}
          comment={comment}
          postId={post.id}
        />
      ));
  }
  return (
    <Modal centered={false} open onClose={() => toggle()}>
      <Modal.Content>
        <Post
          user={currentUser}
          post={post}
          likePost={like}
          toggleExpandedPost={toggle}
          deletePost={cut}
          updatePost={update}
        />
        <CommentUI.Group style={{ maxWidth: '100%' }}>
          <Header as="h3" dividing>
            Comments
          </Header>
          {sortedComments}
          {currentUser.roles?.[0].name !== GUEST
            ? <AddComment postId={post.id} addComment={add}/>
            : <Message header={GUEST} content="You are not allowed to add comments"/>}
        </CommentUI.Group>
      </Modal.Content>
      <Modal.Actions>
        { Boolean(error) && error.status === 403 && <ModalNotAllowed resetError={resetErr} />}
        { Boolean(error) && error.status !== 403 && <Message error header="Server error!" content={error.message} />}
      </Modal.Actions>
    </Modal>
  );
};

ExpandedPost.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  error: PropTypes.objectOf(PropTypes.any),
  postsResetError: PropTypes.func.isRequired
};
ExpandedPost.defaultProps = {
  error: null
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost,
  user: rootState.profile.user,
  error: rootState.posts.error
});

// eslint-disable-next-line max-len
const actions = {
  likePost,
  deletePost,
  updatePost,
  toggleExpandedPost,
  addComment,
  postsResetError
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
