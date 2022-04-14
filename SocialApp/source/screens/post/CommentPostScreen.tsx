import * as React from 'react';
import {View, Text, FlatList} from 'react-native';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  BLACK,
  BLUE_GRAY,
  BLUE_GRAY_200,
  LIGHT_BLUE,
  WHITE,
} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {
  requestCreateComment,
  requestGetComment,
  updateListComment,
} from '../../feature/post/postSlice';
import LoadingScreen from '../../components/LoadingScreen';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Socket} from 'socket.io-client';
import CommentComponent from '../../components/CommentComponent';
import {socket} from '../../socket/SocketClient';

interface CommentPostProps {
  route: {
    params: {
      postID: string;
    };
  };
}

type FormValues = {
  content: string;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: ${HEIGHT / 100}px;
`;

const HeaderText = styled.Text`
  font-weight: 700;
  font-size: ${normalize(18)}px;
  color: ${BLACK};
`;

const BottomContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${(HEIGHT / 100) * 1.75}px;
  border-top-width: 1px;
  border-color: ${BLUE_GRAY};
`;

const InputContainer = styled.View`
  flex: 1;
  border-width: 1px;
  border-color: ${BLUE_GRAY_200}};
  border-radius: ${(WIDTH / 100) * 12}px;
  margin-horizontal: ${(WIDTH / 100) * 2}px;
`;

const InputText = styled.TextInput`
  width: 100%;
  padding-vertical: 0px;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  height: ${(HEIGHT / 100) * 4}px;
  font-size: ${normalize(12)}px;
  font-weight: 400;
  color: ${BLACK};
`;

const ToolButton = styled.TouchableOpacity`
  padding-horizontal: ${(WIDTH / 100) * 3}px;
`;

export default function CommentPostScreen(props: CommentPostProps) {
  const dispatch = useAppDispatch();
  const {control, handleSubmit, resetField} = useForm<FormValues>();
  const refSocket = React.useRef<Socket>();

  const listComment = useAppSelector(state => state.post.listComment);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const [isRefresh, setIsRefresh] = React.useState(false);

  const getListComment = async (page: number) => {
    setIsLoading(true);
    const response = await dispatch(
      requestGetComment({page, postID: props.route.params.postID}),
    ).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotal(response.total);
      }
      setCurrentPage(page);
    }
    setIsLoading(false);
  };

  const onLoadMore = () => {
    if (listComment.length < total) {
      dispatch(
        requestGetComment({
          page: currentPage + 1,
          postID: props.route.params.postID,
        }),
      );
    }
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getListComment(1);
    setIsRefresh(false);
  };

  const onCreateComment: SubmitHandler<FormValues> = async data => {
    if (data.content === '') {
      return;
    }
    resetField('content');
    setIsLoading(true);
    const response = await dispatch(
      requestCreateComment({
        content: data.content,
        image: null,
        postID: props.route.params.postID,
      }),
    ).unwrap();
    if (response.status) {
      refSocket?.current?.emit('createComment', response.comment);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    getListComment(1);
  }, []);

  React.useEffect(() => {
    socket.on('updateComment', comment => {
      dispatch(updateListComment({comment}));
    });
    return () => {
      socket.off('updateComment');
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    refSocket.current = socket;
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>Bình luận</HeaderText>
      </HeaderContainer>

      <FlatList
        data={listComment}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return <CommentComponent item={item} />;
        }}
        refreshing={isRefresh}
        onRefresh={onRefresh}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
      <BottomContainer>
        <Controller
          name="content"
          control={control}
          render={({field: {value, onChange}}) => {
            return (
              <InputContainer>
                <InputText
                  value={value}
                  onChangeText={onChange}
                  placeholder={'Viết bình luận của bạn tại đây...'}
                />
              </InputContainer>
            );
          }}
        />
        <ToolButton onPress={handleSubmit(onCreateComment)}>
          <FontAwesome5
            name={'paper-plane'}
            solid={true}
            color={LIGHT_BLUE}
            size={(WIDTH / 100) * 4.5}
          />
        </ToolButton>
      </BottomContainer>
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
