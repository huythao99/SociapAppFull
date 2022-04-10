import React, {useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import UserItem from '../../components/UserItem';
import {BLACK, BLUE_GREY_100, WHITE} from '../../constant/color';
import {useAppSelector, useAppDispatch} from '../../app/hook';
import {requestGetUser} from '../../feature/user/userSlice';
import LoadingScreen from '../../components/LoadingScreen';
import LineItem from '../../components/LineItem';
import {HEIGHT, normalize, WIDTH} from '../../constant/dimensions';
import {Controller, useForm} from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
  const {
    control,
    watch,
    formState: {errors},
  } = useForm<FormValues>();
  const [listPeople, setListPeople] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalUser, setTotalUser] = React.useState(0);
  const [timer, setTimer] = React.useState(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const textSearch = watch('textSearch', '');
  const getData = async (page: number) => {
    setIsLoading(true);
    const response = await dispatch(
      requestGetUser({page: page, filter: textSearch}),
    ).unwrap();
    if (response.status) {
      if (page === 1) {
        setTotalUser(response.totalUser);
        setListPeople(response.listUser);
      } else {
        setListPeople([...listPeople, ...response.listUser]);
      }
      setCurrentPage(response.currentPage);
    }
    setIsLoading(false);
  };

  const renderItem = ({item}) => {
    return <UserItem item={item} />;
  };

  React.useEffect(() => {
    let newTimer = timer;
    if (newTimer) {
      clearTimeout(newTimer);
    }
    newTimer = setTimeout(() => {
      getData(1);
    }, 1000);
    setTimer(newTimer);
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
      />
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
