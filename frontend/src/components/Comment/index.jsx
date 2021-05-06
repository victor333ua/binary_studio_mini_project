import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Comment as CommentUI, Form, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles.module.scss';
import { DeleteDialog } from '../DeleteDialog';

const Comment = (
  { comment: { id, body, createdAt, user, likeCount, dislikeCount },
    likeComment,
    updateComment,
    deleteComment,
    userId
  }
) => {
  const isMineComment = userId === user.id;

  const [text, setText] = useState(body);
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const onCloseDeleteDialog = () => setDeleteDialog(false);
  const onDelete = async () => {
    await deleteComment(id);
    setDeleteDialog(false);
  };
  const onUpdateComment = async () => {
    await updateComment({ id, body: text });
    setEditMode(false);
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
                <CommentUI.Action as="a" onClick={() => likeComment(id, true)}>
                  <Icon name="thumbs up"/>
                  {likeCount}
                </CommentUI.Action>
                <CommentUI.Action as="a" onClick={() => likeComment(id, false)}>
                  <Icon name="thumbs down"/>
                  {dislikeCount}
                </CommentUI.Action>
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
            <Form edit comment>
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
  userId: PropTypes.string.isRequired,
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  likeComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired
};

export default Comment;
