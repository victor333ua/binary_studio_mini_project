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
import './styles.module.scss';
import { bindActionCreators } from 'redux';
import * as imageService from '../../services/imageService';
import { saveUser } from './actions';

const Profile = ({ user, status, error, saveUser: save }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [email, setEMail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState(user.username);
  const [image, setImage] = useState(getUserImgLink(user.image));
  const [isUploading, setIsUploading] = useState(false);
  const [errorUploadingImage, setErrorUploading] = useState(null);
  const [isShowPassword, setShowPassword] = useState(false);

  const combinedError = error || errorUploadingImage;
  const iconName = isShowPassword ? 'eye slash' : 'eye';
  const passwordType = isShowPassword ? 'text' : 'password';

  const changeVisibility = e => {
    setShowPassword(!isShowPassword);
    e.preventDefault();
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id, link } = await imageService.uploadImage(target.files[0]);
      setImage({ id, link });
    } catch (err) {
      setErrorUploading(err);
    } finally {
      setIsUploading(false);
    }
  };

  const formSubmit = () => {
    const userImage = image?.id === user.image?.id ? user.image : image;
    let pass = null;
    if (password !== '') pass = password;
    const newUser = { id: user.id, email, password: pass, username, image: userImage };
    save(newUser);
    setEditMode(false);
    setShowPassword(false);
  };

  return (
    <Grid container textAlign="center" verticalAlign="middle" style={{ paddingTop: 30 }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Image centered src={image.link} size="medium" circular />
        <br />
        <br />
        <Form size="large" onSubmit={formSubmit} error={Boolean(combinedError)}>
          <Form.Input
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
            fluid
            icon="at"
            iconPosition="left"
            placeholder="Email"
            disabled={!isEditMode}
            type="email"
            value={email}
            onChange={e => setEMail(e.target.value)}
          />
          <br />
          <Message
            error
            header="Server error"
            content={combinedError}
          />
          <Form.Input
            fluid
            iconPosition="left"
            icon="lock"
            placeholder="Password"
            type={passwordType}
            disabled={!isEditMode}
            value={password}
            onChange={e => setPassword(e.target.value)}
            action={{ icon: iconName, disabled: !isEditMode, type: 'button', onClick: e => changeVisibility(e) }}
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
                  Attach image
                  <input name="image" type="file" onChange={handleUploadFile} hidden />
                </Button>
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
  error: PropTypes.string,
  saveUser: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {},
  error: null
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user,
  status: rootState.profile.status,
  error: rootState.profile.error
});

const actions = { saveUser };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
