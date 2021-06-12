import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Item, Message } from 'semantic-ui-react';
import { loadUsers, saveRole } from '../Profile/actions';
import Spinner from '../../components/Spinner';
import styles from '../Thread/styles.module.scss';
import adminStyle from './styles.module.scss';
import { AdminChangeRole } from '../../components/AdminChangeRole';

const AdminPage = ({ users, allRoles, loadUsers: loadAll, saveRole: saveUserRole, status, error }) => {
  const [isModal, setModal] = useState(false);
  const [roleUser, setUser] = useState(null);

  useEffect(() => {
    if (!users) { loadAll(); }
  }, []);

  const userChoice = (e, user) => {
    setUser(user);
    setModal(true);
    e.preventDefault();
  };

  const items = users
    && users.map(user => (
      <Item key={user.id} className={adminStyle.adminItem} onClick={e => userChoice(e, user)} >
        <Item.Image size="tiny" src={user.image.link} />
        <Item.Content verticalAlign="middle">
          <Item.Header style={{ fontSize: '1rem' }}>
            {user.username}
          </Item.Header>
          <Item.Meta style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
            {user.roles[0].name}
          </Item.Meta>
        </Item.Content>
      </Item>
    ));

  return (
    <Container text className={styles.threadContent}>
      {status === 'loading' && <Spinner />}
      {error !== null && <Message header="Server error!" content={error} error />}
      {status === 'completed'
        && (
          <Item.Group divided style={{ maxWidth: 450 }}>
            {items}
          </Item.Group>
        )}
      {isModal && (
        <AdminChangeRole
          user={roleUser}
          roles={allRoles}
          close={() => setModal(false)}
          saveRole={saveUserRole}
        />
      )}
    </Container>
  );
};
AdminPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  allRoles: PropTypes.arrayOf(PropTypes.object),
  loadUsers: PropTypes.func.isRequired,
  saveRole: PropTypes.func.isRequired,
  error: PropTypes.string,
  status: PropTypes.string
};
AdminPage.defaultProps = {
  users: null,
  allRoles: null,
  error: null,
  status: 'idle'
};
const mapStateToProps = rootState => ({
  users: rootState.profile.users,
  allRoles: rootState.profile.roles,
  error: rootState.profile.error,
  status: rootState.profile.status
});
const actions = {
  loadUsers,
  saveRole
};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPage);
