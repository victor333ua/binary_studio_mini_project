import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import { Container, Grid, Loader, Message, Segment } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { loadMorePosts } from './asyncThunks';
import { postsReset } from './slice';

import styles from './styles.module.scss';
import CustomCheckbox from '../../components/CustomCheckbox';
import { GUEST } from '../../scenes/rolesConstants';
import { ModalNotAllowed } from '../../components/ModalNotAllowed';

const label = ['my own posts', "other people's", 'with my like'];

const Thread = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.profile.user);
  const posts = useSelector(state => state.posts.posts);
  const { selector, from, count } = useSelector(state => state.posts.pFilter);
  const hasMorePosts = useSelector(state => state.posts.hasMorePosts);
  const expandedPost = useSelector(state => state.posts.expandedPost);
  const error = useSelector(state => state.posts.error);
  // const status = useSelector(state => state.posts.status);

  // after redirect we read state from redux and set shifter accordingly
  const [shifter, setShifter] = useState([...Array(3)].map(
    (item, index) => Boolean(selector !== 0 && index === (selector - 1))
  ));

  // simultaneously only one switch can be on
  const onToggle = i => () => {
    setShifter(shifter.map((item, index) => (i === index ? !item : false)));
    dispatch(postsReset());
  };

  const getMorePosts = () => {
    dispatch(loadMorePosts({ selector: shifter.findIndex(item => item) + 1, from, count }));
  };

  const switchesList = [0, 1, 2].map(index => (
    <Grid.Column key={label[index]}>
      <CustomCheckbox label={label[index]} checked={shifter[index]} onChange={onToggle(index)}/>
    </Grid.Column>
  ));

  return (
    <Container text className={styles.threadContent}>
      {error && error.status === 403 && <ModalNotAllowed />}
      {error && error.status !== 403 && <Message error header="Server error!" content={error.message} />}
      <div className={styles.addPostForm}>
        {user.roles?.[0].name !== GUEST
          ? <AddPost />
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
        {posts.map(post => (<Post post={post} key={post.id} />))}
      </InfiniteScroll>
      {expandedPost && <ExpandedPost />}
    </Container>
  );
};
export default Thread;
