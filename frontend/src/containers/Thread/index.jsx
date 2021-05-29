/* eslint-disable no-unused-vars */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import { Container, Grid, Loader, Segment } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { addPost, deletePost, likePost, loadMorePosts, loadPosts, updatePost } from './actions';
import { toggleExpandedPost } from '../ExpandedPost/actions';

import styles from './styles.module.scss';
import CustomCheckbox from '../../components/CustomCheckbox';

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
  posts = [],
  expandedPost,
  hasMorePosts,
  selector,
  addPost: createPost,
  likePost: like,
  toggleExpandedPost: onExpPost,
  deletePost: cut,
  updatePost: update
}) => {
  // after redirect we read state from redux and set switches accordingly
  const [shifter, setShifter] = useState([...Array(3)].map(
    (item, index) => selector !== 0 && index === (selector - 1)
  ));

  // simultaneously only one switch can be on
  const toggle = i => () => {
    setShifter(shifter.map((item, index) => (i === index ? !item : false)));
  };
  useLayoutEffect(() => {
    postsFilter.from = 0;
    postsFilter.selector = shifter.findIndex(item => item) + 1;
    const getPosts = async () => { await load(postsFilter); };
    getPosts();
    postsFilter.from = postsFilter.count;
  }, [shifter, load]);

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

  return (
    <Container text className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} />
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
  selector: PropTypes.number.isRequired,
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
  selector: rootState.posts.selector,
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
