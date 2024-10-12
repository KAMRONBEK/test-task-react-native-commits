import { PoppinsFonts } from '@/assets/fonts/poppins.fonts';
import CommentList from '@/components/Comments/CommentList';
import CreateCommentInput from '@/components/Comments/CreateCommentInput';
import Container from '@/components/Container';
import RN from '@/components/RN';
import { Spacing } from '@/components/Spacing';
import { COLORS } from '@/constants/colors';
import { CoreStyle } from '@/styles/global';

function MainScreen() {
  return (
    <Container mainStyle={CoreStyle.flex1}>
      <RN.Text style={styles.title}>{'Comments screen'}</RN.Text>
      <Spacing steps={3} />
      <CreateCommentInput />
      <CommentList />
    </Container>
  );
}

const styles = RN.StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: PoppinsFonts.Poppins_600,
    color: COLORS.orange,
    textAlign: 'center',
  },
});

export default MainScreen;
