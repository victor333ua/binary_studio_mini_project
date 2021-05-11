import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, Form, Message, Button, Popup } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import moment from 'moment';

import styles from './styles.module.scss';
import { DeleteDialog } from '../DeleteDialog';
import * as imageService from '../../services/imageService';

const Post = ({ user: currentUser, post, likePost, toggleExpandedPost, sharePost, deletePost, updatePost }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt,
    reactions
  } = post;

  const date = moment(createdAt).fromNow();
  const isMinePost = currentUser.id === user.id;

  const [text, setText] = useState(body);
  const [isEdit, setEdit] = useState(false);
  const [editImage, setEditImage] = useState(image);
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);

  const rArray = [...reactions];
  const likesReactions = rArray.length ? rArray.filter(r => r.isLike).map(r => r.user.username).join(', ') : ' ';
  const dislikesReactions = rArray.length ? rArray.filter(r => !r.isLike).map(r => r.user.username).join(', ') : ' ';

  const onDeletePost = () => {
    setDeleteDialog(false);
    deletePost(id);
  };
  const onCloseDeleteDialog = () => setDeleteDialog(false);

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id: idImage, link } = await imageService.uploadImage(target.files[0]);
      setEditImage({ id: idImage, link });
    } catch (err) {
      setErrorUploading(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onUpdatePost = () => {
    const postImage = image?.id === editImage?.id ? image : editImage;
    updatePost({ id: post.id, createdAt: post.createdAt, user: post.user, body: text, image: postImage });
    setEdit(false);
  };

  return (
    <>
      <DeleteDialog open={openDeleteDialog} header="Delete Post" onClose={onCloseDeleteDialog} onDelete={onDeletePost}/>
      <Card style={{ width: '100%' }}>
        {editImage && <Image src={editImage.link} wrapped ui={false} />}
        <Card.Content>
          <Card.Meta>
            <span className="date">
              posted by
              {' '}
              {user.username}
              {' - '}
              {date}
            </span>
          </Card.Meta>
          <Card.Description>
            {!isEdit ? text
              : (
                <Form error={Boolean(errorUploadingImage)}>
                  <Form.Field
                    control={TextareaAutosize}
                    onChange={e => setText(e.target.value)}
                    value={text}
                  />
                  <Message
                    error
                    header="Upload Image to Imgur - Server error"
                    content={errorUploadingImage}
                  />
                  <Button content="Cancel" floated="right" onClick={() => setEdit(false)} secondary/>
                  <Button content="Save" floated="right" onClick={() => onUpdatePost()} primary/>
                  <Button as="label" icon labelPosition="left" floated="left" loading={isUploading}>
                    <Icon name="image" />
                    Attach/change image
                    <input name="image" type="file" onChange={handleUploadFile} hidden />
                  </Button>
                </Form>
              )}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Popup
                trigger={
                  (
                    <Label
                      basic
                      size="small"
                      as="a"
                      className={styles.toolbarBtn}
                      onClick={() => likePost(id, user.id, true, currentUser)}
                    >
                      <Icon name="thumbs up" />
                      {likeCount}
                    </Label>
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
                    <Label
                      basic
                      size="small"
                      as="a"
                      className={styles.toolbarBtn}
                      onClick={() => likePost(id, user.id, false, currentUser)}
                    >
                      <Icon name="thumbs down" />
                      {dislikeCount}
                    </Label>
                  )
                }
              >
                <Popup.Content>
                  {dislikesReactions}
                </Popup.Content>
              </Popup>
              <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
                <Icon name="comment" />
                {commentCount}
              </Label>
              <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
                <Icon name="share alternate" />
              </Label>
            </div>
            {isMinePost
              && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => setEdit(true)}>
                    <Icon name="edit"/>
                  </Label>
                  <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => setDeleteDialog(true)}>
                    <Icon name="cut"/>
                  </Label>
                </div>
              )}
          </div>
        </Card.Content>
      </Card>
    </>
  );
};

Post.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  likePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired
};

export default Post;
