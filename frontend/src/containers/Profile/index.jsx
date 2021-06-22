import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Button,
  Form,
  Grid, Icon,
  Image, Message
} from 'semantic-ui-react';
import validator from 'validator';
import styles from './styles.module.scss';
import * as imageService from '../../services/imageService';
import { saveUser } from './asyncThunks';
import PasswordInput from '../../components/PasswordInput';
import { profileResetError } from './slice';

const Profile = () => {
  const user = useSelector(state => state.profile.user);
  const status = useSelector(state => state.profile.status);
  const error = useSelector(state => state.profile.error?.message);

  const [isEditMode, setEditMode] = useState(false);
  const [email, setEMail] = useState(user.email);
  const [password, setPassword] = useState(null);
  const [username, setUserName] = useState(user.username);
  const [image, setImage] = useState(getUserImgLink(user.image));
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const dispatch = useDispatch();
  const combinedError = error || errorUploadingImage;
  let headerMessage = '';
  if (error) headerMessage = 'Server Error';
  if (errorUploadingImage) headerMessage = 'Error Uploading Image';

  const handleUploadFile = async ({ target }) => {
    setErrorUploading(null);
    setIsUploading(true);
    try {
      const { id, link } = await imageService.uploadImage(target.files[0]);
      setImage({ id, link });
    } catch (err) {
      setErrorUploading(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const setNewValue = funcSetNew => value => {
    dispatch(profileResetError());
    funcSetNew(value);
  };

  const formSubmit = () => {
    if (!isEmailValid) return;
    const userImage = image?.id === user.image?.id ? user.image : image;
    const newUser = { ...user, email, password, username, image: userImage };
    dispatch(saveUser(newUser));
    setEditMode(false);
  };

  const onCancel = () => {
    setEMail(user.email);
    setUserName(user.username);
    setEditMode(false);
  };

  return (
    <Grid container textAlign="center" verticalAlign="middle" style={{ paddingTop: 30 }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Image centered src={image.link} size="medium" circular />
        <br />
        <br />
        <Form size="large" onSubmit={formSubmit} error={Boolean(combinedError)}>
          <Form.Input
            className={styles.passwordInput}
            fluid
            icon="user"
            iconPosition="left"
            placeholder="Username"
            type="text"
            disabled={!isEditMode}
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
          <br />
          <Form.Input
            className={styles.passwordInput}
            fluid
            icon="at"
            iconPosition="left"
            placeholder="Email"
            disabled={!isEditMode}
            type="email"
            value={email}
            error={!isEmailValid}
            onChange={e => setNewValue(setEMail)(e.target.value)}
            onBlur={() => setIsEmailValid(validator.isEmail(email))}
          />
          <br />
          <PasswordInput
            className={styles.passwordInput}
            eyeClassName={styles.eye}
            isDisabled={!isEditMode}
            onChangePassword={setNewValue(setPassword)}
          />
          <Message
            error
            header={headerMessage}
            content={combinedError}
          />
          <br />
          <br />
          { isEditMode
            ? (
              <>
                <Button
                  as="label"
                  icon
                  labelPosition="left"
                  color="teal"
                  size="large"
                  floated="left"
                  loading={isUploading}
                >
                  <Icon name="image" />
                  Image
                  <input name="image" type="file" onChange={handleUploadFile} hidden />
                </Button>
                <Button
                  content="Cancel"
                  type="button"
                  color="teal"
                  size="large"
                  floated="right"
                  onClick={onCancel}
                />
                <Button
                  content="Save"
                  type="submit"
                  color="teal"
                  size="large"
                  floated="right"
                  loading={status === 'loading'}
                />
              </>
            )
            : (
              <Button
                floated="right"
                content="Edit"
                color="teal"
                size="large"
                onClick={() => setEditMode(true)}
              />
            )}
        </Form>
      </Grid.Column>
    </Grid>
  );
};
export default Profile;
