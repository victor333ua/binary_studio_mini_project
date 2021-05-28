/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import { Checkbox, Container, Grid, Loader, Segment } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { loadPosts, loadMorePosts, likePost, addPost, updatePost, deletePost } from './actions';
import { toggleExpandedPost } from '../ExpandedPost/actions';

import styles from './styles.module.scss';
import CustomCheckbox from '../../components/CustomCheckbox';

const postsFilter = {
  userId: undefined,
  isMine: undefined,
  from: 0,
  count: 10
};

const Thread = ({
  user,
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
  const [showAnothersPosts, setShowAnothersPosts] = useState(false);
  const [showPostsWithMyLikes, setShowPostsWithMyLikes] = useState(false);

  const toggleShowOwnPosts = () => {
    setShowOwnPosts(!showOwnPosts);
    setShowAnothersPosts(false);
    setShowPostsWithMyLikes(false);
    // we have old value of showOwnPosts here yet
    postsFilter.userId = showOwnPosts ? undefined : user.id;
    postsFilter.isMine = true;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const toggleShowAnothersPosts = () => {
    setShowAnothersPosts(!showAnothersPosts);
    setShowPostsWithMyLikes(false);
    setShowOwnPosts(false);
    postsFilter.userId = showAnothersPosts ? undefined : user.id;
    postsFilter.isMine = false;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const toggleShowPostsWithMyLikes = () => {
    setShowPostsWithMyLikes(!showPostsWithMyLikes);
    setShowAnothersPosts(false);
    setShowOwnPosts(false);
    postsFilter.userId = showPostsWithMyLikes ? undefined : user.id;
    postsFilter.isMine = undefined;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  return (
    <Container text className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} />
      </div>
      <Segment className={styles.toolbar}>
        <Grid textAlign="center" columns={3} >
          <Grid.Column >
            <CustomCheckbox label="my own" checked={showOwnPosts} onChange={toggleShowOwnPosts}/>
          </Grid.Column>
          <Grid.Column >
            <CustomCheckbox label="other's" checked={showAnothersPosts} onChange={toggleShowAnothersPosts}/>
          </Grid.Column>
          <Grid.Column >
            <CustomCheckbox label="with my like" checked={showPostsWithMyLikes} onChange={toggleShowPostsWithMyLikes}/>
          </Grid.Column>
        </Grid>
      </Segment>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            user={user}
            post={post}
            likePost={like}
            toggleExpandedPost={toggle}
            deletePost={cut}
            updatePost={update}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && <ExpandedPost />}
    </Container>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
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
  user: {}
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  user: rootState.profile.user
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
