import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment, Message } from 'semantic-ui-react';

import styles from './styles.module.scss';
import * as imageService from '../../services/imageService';

const AddPost = ({
  addPost
}) => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);
  const [errorAddingPost, setErrorAddingPost] = useState(null);
  const [isAddPostLoading, setIsAddPostLoading] = useState(false);

  const handleAddPost = async () => {
    if (!body) {
      return;
    }
    setIsAddPostLoading(true);
    try {
      await addPost({
        imageId: image?.imageId,
        body
      });
    } catch (err) {
      setErrorAddingPost(err.message);
    } finally {
      setBody('');
      setImage(undefined);
      setIsAddPostLoading(false);
    }
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await imageService.uploadImage(target.files[0]);
      setImage({ imageId, imageLink });
    } catch (err) {
      setErrorUploading(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const isError = errorUploadingImage || errorAddingPost;

  return (
    <Segment>
      <Form onSubmit={handleAddPost} error={Boolean(isError)}>
        <Form.TextArea
          name="body"
          value={body}
          placeholder="What is the news?"
          onChange={ev => setBody(ev.target.value)}
        />
        <Message
          error
          header="Server error"
          content={isError}
        />
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={image?.imageLink} alt="post" />
          </div>
        )}
        <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
          <Icon name="image" />
          Attach image
          <input name="image" type="file" onChange={handleUploadFile} hidden />
        </Button>
        <Button floated="right" color="blue" type="submit" loading={isAddPostLoading}>Post</Button>
      </Form>
    </Segment>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default AddPost;
