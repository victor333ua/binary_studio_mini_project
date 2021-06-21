import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Comment as CommentUI, Form, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import { DeleteDialog } from '../DeleteDialog';
import { deleteComment, likeComment, updateComment } from '../../containers/ExpandedPost/asyncThunks';

const Comment = (
  { comment: { id, body, createdAt, user, likeCount, dislikeCount, reactions },
    user: currentUser,
    postId
  }
) => {
  const isMineComment = currentUser.id === user.id;

  const rArray = [...reactions];
  const likesReactions = rArray.length ? rArray.filter(r => r.isLike).map(r => r.user.username).join(', ') : ' ';
  const dislikesReactions = rArray.length ? rArray.filter(r => !r.isLike).map(r => r.user.username).join(', ') : ' ';

  const [text, setText] = useState(body);
  useEffect(() => {
    if (text !== body) setText(body);
  }, [body]);

  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const onCloseDeleteDialog = () => setDeleteDialog(false);

  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(deleteComment({ id, postId }));
    setDeleteDialog(false);
  };

  const onUpdateComment = () => {
    dispatch(updateComment({ id, body: text, postId }));
    setEditMode(false);
  };

  const onLikeComment = isLike => {
    dispatch(likeComment({ commentId: id, isLike, postId, currentUser }));
  };

  return (
    <>
      <CommentUI className={styles.comment}>
        <CommentUI.Avatar src={getUserImgLink(user.image).link}/>
        <CommentUI.Content>
          <CommentUI.Author as="a">
            {user.username}
          </CommentUI.Author>
          <CommentUI.Metadata>
            {moment(createdAt).fromNow()}
          </CommentUI.Metadata>
          <CommentUI.Text>
            {!isEditMode && text}
          </CommentUI.Text>
          <CommentUI.Actions>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Popup
                  trigger={
                    (
                      <CommentUI.Action as="a" onClick={() => onLikeComment(true)}>
                        <Icon name="thumbs up"/>
                        {likeCount}
                      </CommentUI.Action>
                    )
                  }
                >
                  <Popup.Content>
                    {likesReactions}
                  </Popup.Content>
                </Popup>
                <Popup
                  trigger={
                    (
                      <CommentUI.Action as="a" onClick={() => onLikeComment(false)}>
                        <Icon name="thumbs down"/>
                        {dislikeCount}
                      </CommentUI.Action>
                    )
                  }
                >
                  <Popup.Content>
                    {dislikesReactions}
                  </Popup.Content>
                </Popup>
              </div>
              <DeleteDialog
                open={openDeleteDialog}
                header="Delete Comment"
                onClose={onCloseDeleteDialog}
                onDelete={onDelete}
              />
              {isMineComment
              && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CommentUI.Action as="a" onClick={() => setEditMode(true)}>
                    <Icon name="edit"/>
                  </CommentUI.Action>
                  <CommentUI.Action as="a" onClick={() => setDeleteDialog(true)}>
                    <Icon name="cut"/>
                  </CommentUI.Action>
                </div>
              )}
            </div>
          </CommentUI.Actions>
          {isEditMode && (
            <Form edit="true" comment>
              <Form.Field
                control={TextareaAutosize}
                onChange={e => setText(e.target.value)}
                value={text}
              />
              <Button content="Cancel" floated="right" type="button" onClick={() => setEditMode(false)}/>
              <Button content="Save" floated="right" onClick={() => onUpdateComment()}/>
            </Form>
          )}
        </CommentUI.Content>
      </CommentUI>
    </>
  );
};
Comment.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  postId: PropTypes.string.isRequired
};

export default Comment;
