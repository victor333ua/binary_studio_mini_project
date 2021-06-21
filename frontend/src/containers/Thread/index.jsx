/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import { Container, Grid, Loader, Message, Segment } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { addPost, deletePost, likePost, updatePost, loadMorePosts } from './asyncThunks';
import { toggleExpandedPost } from '../ExpandedPost/asyncThunks';
import { postsReset, postsResetError } from './slice';

import styles from './styles.module.scss';
import CustomCheckbox from '../../components/CustomCheckbox';
import { GUEST } from '../../scenes/rolesConstants';
import { ModalNotAllowed } from '../../components/ModalNotAllowed';

const label = ['my own posts', "other people's", 'with my like'];

const Thread = ({
  user,
  loadMorePosts: loadMore,
  posts,
  expandedPost,
  hasMorePosts,
  pFilter: { selector, from, count },
  addPost: createPost,
  likePost: like,
  toggleExpandedPost: toggle,
  deletePost: cut,
  updatePost: update,
  error,
  postsResetError: resetErr,
  postsReset: resetPosts,
  status
}) => {
  // after redirect we read state from redux and set shifter accordingly
  const [shifter, setShifter] = useState([...Array(3)].map(
    (item, index) => Boolean(selector !== 0 && index === (selector - 1))
  ));

  // simultaneously only one switch can be on
  const onToggle = i => () => {
    setShifter(shifter.map((item, index) => (i === index ? !item : false)));
    resetPosts();
  };

  const getMorePosts = () => {
    loadMore({ selector: shifter.findIndex(item => item) + 1, from, count });
  };

  const switchesList = [0, 1, 2].map(index => (
    <Grid.Column key={label[index]}>
      <CustomCheckbox label={label[index]} checked={shifter[index]} onChange={onToggle(index)}/>
    </Grid.Column>
  ));

  return (
    <Container text className={styles.threadContent}>
      {error && error.status === 403 && <ModalNotAllowed resetError={resetErr} />}
      {error && error.status !== 403 && <Message error header="Server error!" content={error.message} />}
      <div className={styles.addPostForm}>
        {user.roles?.[0].name !== GUEST
          ? <AddPost addPost={createPost} />
          : <Message header={GUEST} content="You are not allowed to add post"/>}
      </div>
      <Segment className={styles.toolbar}>
        <Grid textAlign="center" columns={3} >
          {switchesList}
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
  pFilter: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  error: PropTypes.objectOf(PropTypes.any),
  postsResetError: PropTypes.func.isRequired,
  postsReset: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  user: {},
  pFilter: { selector: 0, from: 0 },
  error: null
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  pFilter: rootState.posts.pFilter,
  error: rootState.posts.error,
  status: rootState.posts.status,
  user: rootState.profile.user
});

const actions = {
  loadMorePosts,
  likePost,
  toggleExpandedPost,
  addPost,
  updatePost,
  deletePost,
  postsResetError,
  postsReset
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
