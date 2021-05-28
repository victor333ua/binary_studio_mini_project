import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Client } from '@stomp/stompjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { applyPost, deletePostAction, likePostAction, updatePostAction } from '../Thread/actions';
// eslint-disable-next-line max-len
import { addCommentAction, deleteCommentAction, likeCommentAction, updateCommentAction } from '../ExpandedPost/actions';

const Notifications = (
  { user,
    expandedPost,
    applyPost: getPost,
    likePostAction: likePost,
    updatePostAction: updatePost,
    deletePostAction: deletePost,
    likeCommentAction: likeComment,
    addCommentAction: addComment,
    updateCommentAction: updateComment,
    deleteCommentAction: deleteComment
  }
) => {
  const { id } = user;
  const currentPostId = expandedPost?.id;

  const likePostCB = message => {
    const { isNewRecord, postId, postOwner, isLike, currentUser } = JSON.parse(message.body);
    // it was my own like
    if (currentUser.id === id) return;
    if (postOwner.id === id && isLike && isNewRecord != null) NotificationManager.info('Your post was liked!');
    likePost({ postId, isLike, isNewRecord, currentUser });
  };

  const getPostCB = async message => {
    const { userId, postId } = JSON.parse(message.body);
    if (userId === id) return; // my new post already added to state
    NotificationManager.info('New Post Added!');
    await getPost(postId);
  };

  const updatePostCB = message => {
    const { id: postId, body, image, currentUser } = JSON.parse(message.body);
    if (currentUser.id === id) return;
    NotificationManager.info(`user ${currentUser.username} changed his post`);
    updatePost({ id: postId, body, image });
  };

  const deletePostCB = message => {
    const { id: postId, currentUser } = JSON.parse(message.body);
    if (currentUser.id === id) return;
    NotificationManager.info(`user ${currentUser.username} deleted his post`);
    deletePost(postId);
  };

  const likeCommentCB = message => {
    const { postId, isNewRecord, commentId, isLike, currentUser } = JSON.parse(message.body);
    if (currentUser.id === id) return; // it was my own like
    if (isLike && isNewRecord != null) NotificationManager.info('Your comment was liked!');
    if (currentPostId === postId) {
      likeComment({ commentId, isLike, isNewRecord, currentUser });
    }
  };

  const addCommentCB = message => {
    const comment = JSON.parse(message.body);
    if (comment.user.id === id) return; // action with my comment already added to state
    NotificationManager.info('New comment added!');
    addComment(comment); // it's necessary for all posts
    // toggleExpandedPost(postId); // get expPost with comments from server
  };

  const updateCommentCB = message => {
    const { userId, postId, id: commentId, body } = JSON.parse(message.body);
    if (userId === id) return; // action with my comment already added to state
    NotificationManager.info('some comment updated!');
    if (currentPostId === postId) {
      updateComment({ id: commentId, body });
    }
  };

  const deleteCommentCB = message => {
    const { userId, postId, id: commentId } = JSON.parse(message.body);
    if (userId === id) return; // action with my comment already added to state
    NotificationManager.info('some comment deleted!');
    deleteComment({ id: commentId, postId }); // it's necessary for all posts
  };

  const containerForStompClient = useRef(null);
  const [isBrokerConnected, setConnected] = useState(false);

  useEffect(() => {
    // const [stompClient] = useState(Stomp.over(new SockJS('/ws')));
    const stompClient = new Client({
      brokerURL: 'ws://192.168.1.103:8080/ws',
      debug() {
        // NotificationManager.info(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    containerForStompClient.current = stompClient;

    stompClient.onConnect = () => {
      NotificationManager.info('connected to web-socket');
      setConnected(true);
    };

    stompClient.onStompError = frame => {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      // eslint-disable-next-line no-console
      NotificationManager.info(`Broker reported error: ${frame.headers.message}`);
      // eslint-disable-next-line no-console
      NotificationManager.info(`Additional details: ${frame.body}`);
    };

    stompClient.onWebSocketError = evt => {
      NotificationManager.info(`webSocket reported error: ${evt.message}`);
    };

    stompClient.activate();

    return () => stompClient.deactivate();
  }, []);

  useEffect(() => {
    const stompClient = containerForStompClient.current;
    if (stompClient === null || !isBrokerConnected || user === undefined) return undefined;

    const postLike = stompClient.subscribe('/topic/post/like', likePostCB);
    const postNew = stompClient.subscribe('/topic/post/new', getPostCB);
    const postUpdate = stompClient.subscribe('/topic/post/update', updatePostCB);
    const postDelete = stompClient.subscribe('/topic/post/delete', deletePostCB);

    return () => {
      postLike.unsubscribe();
      postUpdate.unsubscribe();
      postNew.unsubscribe();
      postDelete.unsubscribe();
    };
    // eslint-disable-next-line
  }, [user, isBrokerConnected]);

  useEffect(() => {
    const stompClient = containerForStompClient.current;
    if (!stompClient || !isBrokerConnected || expandedPost === undefined || user === undefined) return undefined;

    const commentLike = stompClient.subscribe('/topic/comments/like', likeCommentCB);
    const commentAdd = stompClient.subscribe('/topic/comments/add', addCommentCB);
    const commentUpdate = stompClient.subscribe('/topic/comments/update', updateCommentCB);
    const commentDelete = stompClient.subscribe('/topic/comments/delete', deleteCommentCB);
    return () => {
      commentLike.unsubscribe();
      commentAdd.unsubscribe();
      commentUpdate.unsubscribe();
      commentDelete.unsubscribe();
    };
    // eslint-disable-next-line
  }, [user, expandedPost, isBrokerConnected]);

  return (
    <>
      <NotificationContainer />
      {/* { expandedPost && <ExpandedPost /> }*/}
    </>
  );
};
Notifications.defaultProps = { user: undefined, expandedPost: undefined };

Notifications.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  expandedPost: PropTypes.objectOf(PropTypes.any),
  applyPost: PropTypes.func.isRequired,
  likePostAction: PropTypes.func.isRequired,
  updatePostAction: PropTypes.func.isRequired,
  deletePostAction: PropTypes.func.isRequired,
  likeCommentAction: PropTypes.func.isRequired,
  addCommentAction: PropTypes.func.isRequired,
  updateCommentAction: PropTypes.func.isRequired,
  deleteCommentAction: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user,
  expandedPost: rootState.posts.expandedPost
});

const actions = {
  applyPost,
  likePostAction,
  updatePostAction,
  deletePostAction,
  likeCommentAction,
  addCommentAction,
  updateCommentAction,
  deleteCommentAction
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
