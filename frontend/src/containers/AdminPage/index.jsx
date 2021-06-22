import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Item, Message } from 'semantic-ui-react';
import { loadUsers, saveRole } from '../Profile/asyncThunks';
import Spinner from '../../components/Spinner';
import styles from '../Thread/styles.module.scss';
import adminStyle from './styles.module.scss';
import { AdminChangeRole } from '../../components/AdminChangeRole';

const AdminPage = () => {
  const [isModal, setModal] = useState(false);
  const [roleUser, setUser] = useState(null);

  const dispatch = useDispatch();
  const users = useSelector(state => state.profile.users);
  const error = useSelector(state => state.profile.error);
  const status = useSelector(state => state.profile.status);
  const allRoles = useSelector(state => state.profile.roles);

  useEffect(() => {
    if (!users) dispatch(loadUsers());
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
          saveRole={dispatch(saveRole())}
        />
      )}
    </Container>
  );
};
export default AdminPage;
