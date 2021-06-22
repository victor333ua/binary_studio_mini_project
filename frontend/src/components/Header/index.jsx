import React from 'react';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button, Container } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { ADMIN } from '../../scenes/rolesConstants';
import { userLogout } from '../../containers/Profile/slice';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile.user);

  return (
    <Container text className={styles.headerWrp}>
      <Grid centered container columns="2" style={{ maxWidth: 450 }}>
        <Grid.Column>
          {user && (
            <NavLink exact to="/">
              <HeaderUI as="h3">
                <Image circular src={getUserImgLink(user.image?.link)} />
                <HeaderUI.Content>
                  { user.username }
                  <HeaderUI.Subheader style={{ fontSize: '10px', fontStyle: 'italic' }}>
                    { user.roles[0]?.name }
                  </HeaderUI.Subheader>
                </HeaderUI.Content>
              </HeaderUI>
            </NavLink>
          )}
        </Grid.Column>
        <Grid.Column textAlign="right">
          {user.roles[0].name === ADMIN
          && (
            <NavLink exact activeClassName="active" to="/admin" className={styles.menuBtn}>
              <Icon name="settings" size="large" />
            </NavLink>
          )}
          <NavLink exact activeClassName="active" to="/profile" className={styles.menuBtn}>
            <Icon name="user circle" size="large" />
          </NavLink>
          <Button
            basic
            icon
            type="button"
            className={`${styles.menuBtn} ${styles.logoutBtn}`}
            onClick={() => dispatch(userLogout())}
          >
            <Icon name="log out" size="large" />
          </Button>
        </Grid.Column>
      </Grid>
    </Container>
  );
};
export default Header;
