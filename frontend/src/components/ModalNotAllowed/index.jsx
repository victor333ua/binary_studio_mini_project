import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { postsResetError } from '../../containers/Thread/slice';

export const ModalNotAllowed = () => {
  const dispatch = useDispatch();

  return (
    <Modal
      dimmer="inverted"
      open
      onClose={e => {
        dispatch(postsResetError());
        e.preventDefault();
      }}
    >
      <Modal.Header>
        Guest!
      </Modal.Header>
      <Modal.Content>
        You do not have permissions to do that
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          onClick={e => {
            dispatch(postsResetError());
            e.preventDefault();
          }}
        >
          Ok
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
