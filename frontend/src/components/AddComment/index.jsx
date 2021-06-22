import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { addComment } from '../../containers/ExpandedPost/asyncThunks';

const AddComment = ({ postId }) => {
  const [body, setBody] = useState('');

  const dispatch = useDispatch();

  const handleAddComment = () => {
    if (!body) return;
    dispatch(addComment({ postId, body }));
    setBody('');
  };

  return (
    <Form reply onSubmit={handleAddComment}>
      <Form.TextArea
        value={body}
        placeholder="Type a comment..."
        onChange={ev => setBody(ev.target.value)}
      />
      <Button type="submit" content="Post comment" labelPosition="left" icon="edit" primary />
    </Form>
  );
};

AddComment.propTypes = {
  postId: PropTypes.string.isRequired
};
export default AddComment;
