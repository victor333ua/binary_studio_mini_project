import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Icon } from 'semantic-ui-react';
import styles from './styles.module.scss';
import { sendEmail } from '../../services/postService';

const SharedPostLink = ({ user, postId, close }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const inputRef = useRef();

  const copyToClipboard = e => {
    e.target.focus();
    inputRef.current.select();
    document.execCommand('copy');
    setCopied(true);
  };

  const sharePost = async () => {
    const message = {
      from: user.email,
      to: email,
      subject: 'see post in Thread',
      text: inputRef.current.inputRef.current.value
    };
    await sendEmail(message);
  };

  return (
    <Modal open onClose={close}>
      <Modal.Header className={styles.header}>
        <span>Share Post</span>
        {copied && (
          <span>
            <Icon color="green" name="copy" />
            Copied
          </span>
        )}
      </Modal.Header>
      <Modal.Content>
        <Input
          fluid
          action={{
            color: 'teal',
            labelPosition: 'right',
            icon: 'copy',
            content: 'Copy',
            onClick: copyToClipboard
          }}
          value={`${window.location.origin}/share/${postId}`}
          ref={inputRef}
        />
        <br/>
        <Input
          fluid
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          onChange={ev => setEmail(ev.target.value)}
          action={{
            color: 'teal',
            labelPosition: 'right',
            icon: 'envelope',
            content: 'send email',
            onClick: sharePost
          }}
        />
      </Modal.Content>
    </Modal>
  );
};

SharedPostLink.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  postId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

export default SharedPostLink;
