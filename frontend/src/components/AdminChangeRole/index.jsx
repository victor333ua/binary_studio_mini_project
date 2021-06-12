import React, { useState } from 'react';
import { Button, Dropdown, Item, Message, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export const AdminChangeRole = ({ user, roles, close, saveRole }) => {
  const [roleIndex, setRoleIndex] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleTitle, setRoleTitle] = useState(user.roles[0].name);

  const options = roles.map((r, index) => ({ key: r.name, text: r.name, value: index }));

  const changeRole = (e, { value }) => {
    setRoleIndex(value);
  };

  const save = async () => {
    setLoading(true);
    const currentRole = roles[roleIndex];
    try {
      await saveRole(user, currentRole);
      setRoleTitle(currentRole.name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal centered={false} open onClose={close}>
        <Modal.Content>
          <Item className={styles.item}>
            <Item.Image size="large" src={user.image.link}/>
            <Item.Content className={styles.itemContent}>
              <Item.Header style={{ fontSize: '1.5rem', fontStyle: 'bold' }}>
                {user.username}
              </Item.Header>
              <Item.Meta style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                {roleTitle}
              </Item.Meta>
              <Item.Description>
                <br/>
                <br/>
                <Dropdown
                  placeholder="Select role"
                  fluid
                  selection
                  options={options}
                  onChange={changeRole}
                />
                <br/>
                <br/>
                <Button content="Change" color="teal" fluid size="large" onClick={save} loading={isLoading}/>
              </Item.Description>
            </Item.Content>
          </Item>
        </Modal.Content>
      </Modal>
      { Boolean(error) && <Message error header="Server error" content={error} /> }
    </>
  );
};
AdminChangeRole.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  close: PropTypes.func.isRequired,
  saveRole: PropTypes.func.isRequired
};

