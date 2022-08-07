import React, {useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import UserItem from '../../components/UserItem';
import {BLACK, BLUE_GREY_100, WHITE} from '../../constant/color';
import {useAppDispatch} from '../../app/hook';
import {requestGetUser} from '../../feature/user/userSlice';
import LoadingScreen from '../../components/LoadingScreen';
import LineItem from '../../components/LineItem';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {Controller, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {UserItem as UserInterface} from '../../constant/types';

type FormValues = {
  textSearch: string;
};

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
  border-radius: ${WIDTH / 2}px;
  margin-vertical: ${(HEIGHT / 100) * 2}px;
  border-width: 1px;
  border-color: ${BLUE_GREY_100};
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const Input = styled.TextInput`
  padding-vertical: 0px;
  font-size: ${normalize(13)}px;
  color: ${BLACK};
  height: ${(HEIGHT / 100) * 5}px;
  flex: 1;
`;

export default function PeopleScreen() {
  const {control, watch} = useForm<FormValues>({
    defaultValues: {textSearch: ''},
  });
  const dispatch = useAppDispatch();
  const [listPeople, setListPeople] = React.useState<UserInterface[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalUser, setTotalUser] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const textSearch = watch('textSearch', '');

  const getData = async (page: number) => {
    setIsLoading(true);
    const response = await dispatch(
      requestGetUser({page: page, filter: textSearch}),
    ).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotalUser(response.totalUser || 0);
        setListPeople(response.listUser || []);
      } else {
        if (response.listUser) {
          setListPeople([...listPeople, ...response.listUser]);
        }
      }
      if (response.currentPage) {
        setCurrentPage(response.currentPage);
      }
    }
    setIsLoading(false);
    setIsRefresh(false);
  };

  const renderItem = ({item}) => {
    return <UserItem item={item} />;
  };

  const onLoadMore = () => {
    if (listPeople.length < totalUser) {
      getData(currentPage + 1);
    }
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getData(1);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      getData(1);
    }, 1000);
    return () => {
      clearTimeout(timer);
      setListPeople([]);
    };
  }, [textSearch]);

  return (
    <Container>
      <Controller
        control={control}
        name="textSearch"
        render={({field: {onChange, onBlur, value}}) => {
          return (
            <SearchContainer>
              <Input
                placeholder={'Tìm kiếm'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
              <FontAwesome5 name={'search'} size={(WIDTH / 100) * 4.5} />
            </SearchContainer>
          );
        }}
      />
      <FlatList
        data={listPeople}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={LineItem}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={isRefresh}
      />
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
