/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { loadPosts, loadMorePosts, likePost, addPost, updatePost, deletePost } from './actions';
import { toggleExpandedPost } from '../ExpandedPost/actions';

import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  from: 0,
  count: 10
};

const Thread = ({
  userId,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  hasMorePosts,
  addPost: createPost,
  likePost: like,
  toggleExpandedPost: toggle,
  deletePost: cut,
  updatePost: update
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);

  const toggleShowOwnPosts = () => {
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = id => {
    setSharedPostId(id);
  };

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} />
      </div>
      <div className={styles.toolbar}>
        <Checkbox
          toggle
          label="Show only my posts"
          checked={showOwnPosts}
          onChange={toggleShowOwnPosts}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            userId={userId}
            post={post}
            likePost={like}
            toggleExpandedPost={toggle}
            sharePost={sharePost}
            deletePost={cut}
            updatePost={update}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && <ExpandedPost sharePost={sharePost} />}
      {sharedPostId && <SharedPostLink postId={sharedPostId} close={() => setSharedPostId(undefined)} />}
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  userId: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  userId: rootState.profile.user.id
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  toggleExpandedPost,
  addPost,
  updatePost,
  deletePost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
