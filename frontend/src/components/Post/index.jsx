import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, Form, Message, Button } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import moment from 'moment';

import styles from './styles.module.scss';
import { DeleteDialog } from '../DeleteDialog';
import * as imageService from '../../services/imageService';

const Post = ({ userId, post, likePost, toggleExpandedPost, sharePost, deletePost, updatePost }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;

  const date = moment(createdAt).fromNow();
  const isMinePost = userId === user.id;

  const [text, setText] = useState(body);
  const [isEdit, setEdit] = useState(false);
  const [editImage, setEditImage] = useState(image);
  const [openDeleteDialog, setDeleteDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);

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
              {/* eslint-disable-next-line max-len */}
              <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id, user.id, true)}>
                <Icon name="thumbs up" />
                {likeCount}
              </Label>
              {/* eslint-disable-next-line max-len */}
              <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id, user.id, false)}>
                <Icon name="thumbs down" />
                {dislikeCount}
              </Label>
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
  userId: PropTypes.string.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  likePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired
};

export default Post;
