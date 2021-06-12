import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const ModalNotAllowed = ({ resetError }) => (
  <Modal
    dimmer="inverted"
    open
    onClose={e => { resetError(); e.preventDefault(); }}
  >
    <Modal.Header>
      Guest!
    </Modal.Header>
    <Modal.Content>
      You do not have permissions to do that
    </Modal.Content>
    <Modal.Actions>
      <Button positive onClick={e => { resetError(); e.preventDefault(); }}>
        Ok
      </Button>
    </Modal.Actions>
  </Modal>
);
ModalNotAllowed.propTypes = {
  resetError: PropTypes.func.isRequired
};
