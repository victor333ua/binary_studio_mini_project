/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import { Button, Comment as CommentUI, Container, Grid, Loader, Message, Modal, Segment } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { addPost, deletePost, likePost, loadMorePosts, loadPosts, resetError, updatePost } from './actions';
import { toggleExpandedPost } from '../ExpandedPost/actions';

import styles from './styles.module.scss';
import CustomCheckbox from '../../components/CustomCheckbox';
import { GUEST } from '../../scenes/rolesConstants';
import { ModalNotAllowed } from '../../components/ModalNotAllowed';

const postsFilter = {
  selector: 0,
  from: 0,
  count: 10
};
const label = ['my own posts', "other people's", 'with my like'];

const Thread = ({
  user,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts,
  expandedPost,
  hasMorePosts,
  pFilter: { selector, from: prevFrom },
  addPost: createPost,
  likePost: like,
  toggleExpandedPost: onExpPost,
  deletePost: cut,
  updatePost: update,
  error,
  resetError: resetErr
}) => {
  // after redirect we read state from redux and set switches accordingly
  const [shifter, setShifter] = useState([...Array(3)].map(
    (item, index) => selector !== 0 && index === (selector - 1)
  ));
  const ref = useRef('1st');

  // simultaneously only one switch can be on
  const toggle = i => () => {
    setShifter(shifter.map((item, index) => (i === index ? !item : false)));
  };
  useLayoutEffect(() => {
    // after redirect we already have fetched posts in redux state
    if (ref.current === '1st' && posts.length) {
      postsFilter.from = prevFrom;
      ref.current = '2rd';
      return;
    }
    ref.current = '2rd';
    postsFilter.from = 0;
    postsFilter.selector = shifter.findIndex(item => item) + 1;
    const getPosts = async () => { await load(postsFilter); };
    getPosts();
    postsFilter.from = postsFilter.count;
  }, [shifter]);

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const switchesList = [0, 1, 2].map(index => (
    <Grid.Column key={label[index]}>
      <CustomCheckbox label={label[index]} checked={shifter[index]} onChange={toggle(index)}/>
    </Grid.Column>
  ));

  const isError = Boolean(error);

  return (
    <Container text className={styles.threadContent}>
      {isError && error.status === 403 && <ModalNotAllowed resetError={resetErr} />}
      {isError && error.status !== 403 && <Message error header="Server error!" content={error.message} />}
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
            toggleExpandedPost={onExpPost}
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
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  error: PropTypes.objectOf(PropTypes.any),
  resetError: PropTypes.func.isRequired
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
  user: rootState.profile.user
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  toggleExpandedPost,
  addPost,
  updatePost,
  deletePost,
  resetError
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
