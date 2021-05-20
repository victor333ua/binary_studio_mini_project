import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import { likePost, deletePost, updatePost } from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';
import { toggleExpandedPost, addComment, likeComment, updateComment, deleteComment } from './actions';

const ExpandedPost = ({
  user: currentUser,
  post,
  likePost: like,
  toggleExpandedPost: toggle,
  deletePost: cut,
  updatePost: update,
  addComment: add,
  likeComment: likeCom,
  updateComment: updateCom,
  deleteComment: deleteCom
}) => (
  <Modal centered={false} open onClose={() => toggle()}>
    {post
      ? (
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
            {post.comments && post.comments
              .sort((c1, c2) => moment(c1.createdAt).diff(moment(c2.createdAt)))
              .map(comment => (
                <Comment
                  key={comment.id}
                  user={currentUser}
                  comment={comment}
                  postId={post.id}
                  likeComment={likeCom}
                  updateComment={updateCom}
                  deleteComment={deleteCom}
                />
              ))}
            <AddComment postId={post.id} addComment={add} />
          </CommentUI.Group>
        </Modal.Content>
      )
      : <Spinner />}
  </Modal>
);

ExpandedPost.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost,
  user: rootState.profile.user
});

// eslint-disable-next-line max-len
const actions = { likePost, deletePost, updatePost, toggleExpandedPost, addComment, likeComment, updateComment, deleteComment };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
