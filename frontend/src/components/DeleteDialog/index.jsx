import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const DeleteDialog = ({ open, header, onClose, onDelete }) => (
  <Modal open={open} size="tiny" closeIcon >
    <Header>
      {header}
    </Header>
    <Modal.Content>
      <p> Are you sure to delete? </p>
    </Modal.Content>
    <Modal.Actions>
      <Button color="red" inverted onClick={() => onClose()}>
        <Icon name="remove" />
        No
      </Button>
      <Button color="green" inverted onClick={() => onDelete()}>
        <Icon name="checkmark" />
        Yes
      </Button>
    </Modal.Actions>
  </Modal>
);

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired
};
