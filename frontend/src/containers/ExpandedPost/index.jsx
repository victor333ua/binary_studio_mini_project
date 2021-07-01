import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Comment as CommentUI, Header, Message } from 'semantic-ui-react';
import moment from 'moment';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import { toggleExpandedPost } from './asyncThunks';
import { GUEST } from '../../scenes/rolesConstants';
import { ModalNotAllowed } from '../../components/ModalNotAllowed';
import { getCurrentUser } from '../Profile/slice';
import { getPostsError } from '../Thread/slice';

const ExpandedPost = () => {
  const dispatch = useDispatch();
  const toggle = () => dispatch(toggleExpandedPost());

  const currentUser = useSelector(getCurrentUser);
  const post = useSelector(state => state.posts.expandedPost);
  const error = useSelector(getPostsError);

  let sortedComments = [];
  if (post.comments) {
    sortedComments = [...post.comments];
    sortedComments = sortedComments
      .sort((c1, c2) => moment(c1.createdAt).diff(moment(c2.createdAt)))
      .map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={post.id}
        />
      ));
  }
  const isForbidden = error?.message === 'Forbidden';

  return (
    <Modal centered={false} open onClose={() => toggle()}>
      <Modal.Content>
        <Post postId={post.id} />
        <CommentUI.Group style={{ maxWidth: '100%' }}>
          <Header as="h3" dividing>
            Comments
          </Header>
          {sortedComments}
          {currentUser.roles?.[0].name !== GUEST
            ? <AddComment postId={post.id} />
            : <Message header={GUEST} content="You are not allowed to add comments"/>}
        </CommentUI.Group>
      </Modal.Content>
      <Modal.Actions>
        { Boolean(error) && isForbidden && <ModalNotAllowed />}
        { Boolean(error) && !isForbidden && <Message error header="Server error!" content={error.message} />}
      </Modal.Actions>
    </Modal>
  );
};
export default ExpandedPost;
