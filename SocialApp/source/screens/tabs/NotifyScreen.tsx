import React from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import ListEmpty from '../../components/ListEmpty';
import NotificationComponent from '../../components/NotificationComponent';
import {BLACK, WHITE} from '../../constant/color';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {
  requestGetListNotification,
  resetListNotification,
} from '../../feature/notification/notificationSlice';

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${HEIGHT / 100}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const HeaderTitle = styled.Text`
  font-size: ${normalize(20)}px;
  font-weight: 700;
  color: ${BLACK};
`;

const HeaderFlatList = () => {
  return (
    <HeaderContainer>
      <HeaderTitle>Thông báo</HeaderTitle>
    </HeaderContainer>
  );
};

export default function NotifyScreen() {
  const dispatch = useAppDispatch();
  const total = useAppSelector(state => state.notify.totalNotification);
  const listNotification = useAppSelector(
    state => state.notify.listNotification,
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isRefresh, setIsRefresh] = React.useState(false);

  const getData = async (page: number) => {
    const res = await dispatch(requestGetListNotification({page})).unwrap();
    if (res.status) {
      setCurrentPage(res.currentPage);
    }
    setIsRefresh(false);
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getData(1);
  };

  const onLoadMore = () => {
    if (listNotification.length < total) {
      getData(currentPage + 1);
    }
  };

  React.useEffect(() => {
    getData(1);
    return () => {
      dispatch(resetListNotification());
    };
  }, []);

  return (
    <Container>
      <FlatList
        data={listNotification}
        renderItem={({item}) => {
          return <NotificationComponent item={item} />;
        }}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={(_, index: number) => index.toString()}
        refreshing={isRefresh}
        onRefresh={onRefresh}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={HeaderFlatList}
      />
    </Container>
  );
}
