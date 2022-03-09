import React, {useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import UserItem from '../../components/UserItem';
import {WHITE} from '../../constant/color';
import {useAppSelector, useAppDispatch} from '../../app/hook';
import {requestGetUser} from '../../feature/user/userSlice';
import LoadingScreen from '../../components/LoadingScreen';
import LineItem from '../../components/LineItem';

const Container = styled.View`
  flex: 1;
  background-color: ${WHITE};
`;

export default function PeopleScreen() {
  const listPeople = useAppSelector(state => state.user.listUser);
  const currentPage = useAppSelector(state => state.user.currentPage);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    await dispatch(requestGetUser({page: currentPage}));
    setIsLoading(false);
  };

  const renderItem = ({item}) => {
    return <UserItem item={item} />;
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
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
