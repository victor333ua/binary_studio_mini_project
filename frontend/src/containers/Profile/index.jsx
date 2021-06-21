import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Button,
  Form,
  Grid, Icon,
  Image, Message
} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import validator from 'validator';
import styles from './styles.module.scss';
import * as imageService from '../../services/imageService';
import { saveUser } from './asyncThunks';
import PasswordInput from '../../components/PasswordInput';

const Profile = ({ user, status, saveUser: save }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [email, setEMail] = useState(user.email);
  const [password, setPassword] = useState(null);
  const [username, setUserName] = useState(user.username);
  const [image, setImage] = useState(getUserImgLink(user.image));
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);
  const [error, setError] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const combinedError = error || errorUploadingImage;

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

  const setNewValue = fSetNew => value => {
    setError(null);
    fSetNew(value);
  };

  const formSubmit = async () => {
    if (!isEmailValid) return;
    const userImage = image?.id === user.image?.id ? user.image : image;
    const newUser = { ...user, email, password, username, image: userImage };
    try {
      await save(newUser);
    } catch (err) {
      setError(err.message);
    }
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
            header="Server error"
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

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  status: PropTypes.string.isRequired,
  saveUser: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user,
  status: rootState.profile.status
});

const actions = { saveUser };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
