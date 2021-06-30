import React, { useState } from 'react';
import { Form, Button, Icon, Image, Segment, Message } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import * as imageService from '../../services/imageService';
import { addPost } from '../../containers/Thread/asyncThunks';
import { getPostsStatus } from '../../containers/Thread/slice';

const AddPost = () => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);

  const status = useSelector(getPostsStatus);
  const isAddPostLoading = status === 'loading';
  const dispatch = useDispatch();

  const handleAddPost = () => {
    if (!body) { return; }
    dispatch(addPost({ imageId: image?.imageId, body }));
    setBody('');
    setImage(undefined);
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
  return (
    <Segment>
      <Form onSubmit={handleAddPost} error={Boolean(errorUploadingImage)}>
        <Form.TextArea
          name="body"
          value={body}
          placeholder="What is the news?"
          onChange={ev => setBody(ev.target.value)}
        />
        <Message
          error
          header="Error Uploading Image"
          content={errorUploadingImage}
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
export default AddPost;
