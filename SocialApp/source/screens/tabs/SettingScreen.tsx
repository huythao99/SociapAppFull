import React from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import ShortcutsComponent from '../../components/ShortcutsComponent';
import {
  BLACK,
  BLUE_GREY_100,
  BLUE_GREY_50,
  GREY_600,
} from '../../constant/color';
import {ARRAY_SHORTCUTS_BUTTON, DEFAULT_AVATAR} from '../../constant/constants';
import {WIDTH, HEIGHT, normalize} from '../../constant/dimensions';
import {requestSignout} from '../../feature/auth/authSlice';
import LoadingScreen from '../../components/LoadingScreen';

const Container = styled.View`
  flex: 1;
  background-color: ${BLUE_GREY_50};
  padding-vertical: ${HEIGHT / 100}px;
`;

const TitleContainer = styled.View`
  margin-vertical: ${HEIGHT / 100 / 2}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: ${normalize(16)}px;
  color: ${BLACK};
`;

const ProfileButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
  padding-vertical: ${HEIGHT / 100 / 2}px;
`;

const AvatarImage = styled.Image`
  width: ${(WIDTH / 100) * 10}px;
  height: ${(WIDTH / 100) * 10}px;
  resize-mode: cover;
  border-radius: ${(WIDTH / 100) * 5}px;
`;

const NameContainer = styled.View`
  padding-horizontal: ${(WIDTH / 100) * 2}px;
`;

const UserNameText = styled.Text`
  font-weight: bold;
  font-size: ${normalize(14)}px;
  color: ${BLACK};
`;

const DetailButtonText = styled.Text`
  font-size: ${normalize(12)}px;
  color: ${GREY_600};
  font-weight: normal;
`;

const LineContainer = styled.View`
  width: 100%;
  margin-horizontal: ${(WIDTH / 100) * 4}px;
  height: 1px;
  background-color: ${BLUE_GREY_100};
  margin-vertical: ${HEIGHT / 100}px;
`;

const ShortcutsText = styled(TitleText)`
  font-size: ${normalize(14)}px;
  padding-horizontal: ${(WIDTH / 100) * 4}px;
`;

const ListContainer = styled.View`
  margin-vertical: ${HEIGHT / 100}px;
  padding-horizontal: ${(WIDTH / 100) * 2}px;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1;
`;

const SignOutButton = styled.TouchableOpacity`
  flex-direction: row;
  margin-vertical: ${(HEIGHT / 100) * 2}px;
  border-radius: ${(WIDTH / 100) * 2}px;
  align-items: center;
  justify-content: center;
  height: ${(HEIGHT / 100) * 4.5}px;
  background-color: ${BLUE_GREY_100};
  margin-horizontal: ${(WIDTH / 100) * 4}px;
`;

const SignOutText = styled(TitleText)`
  font-size: ${normalize(13)}px;
`;

export default function SettingScreen() {
  const avatarUser = useAppSelector(state => state.auth.avatar);
  const nameUser = useAppSelector(state => state.auth.name);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSignOut = () => {
    setIsLoading(true);
    dispatch(requestSignout());
  };

  return (
    <Container>
      <TitleContainer>
        <TitleText>Menu</TitleText>
      </TitleContainer>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <ProfileButton>
          <AvatarImage source={{uri: avatarUser || DEFAULT_AVATAR}} />
          <NameContainer>
            <UserNameText>{nameUser}</UserNameText>
            <DetailButtonText>Xem trang cá nhân của bạn</DetailButtonText>
          </NameContainer>
        </ProfileButton>
        <LineContainer />
        <ShortcutsText>Tất cả lối tắt</ShortcutsText>
        <ListContainer>
          {ARRAY_SHORTCUTS_BUTTON.map((item, index) => {
            return (
              <ShortcutsComponent
                icon={item.icon}
                color={item.color}
                name={item.name}
                key={index.toString()}
              />
            );
          })}
        </ListContainer>
        <SignOutButton onPress={onSignOut}>
          <SignOutText>Đăng xuất</SignOutText>
        </SignOutButton>
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </Container>
  );
}
