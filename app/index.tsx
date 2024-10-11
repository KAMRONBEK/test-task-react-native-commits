import { PoppinsFonts } from '@/assets/fonts/poppins.fonts';
import { Button } from '@/components/Button';
import Container from '@/components/Container';
import { FormInput } from '@/components/FormController';
import RN from '@/components/RN';
import { Spacing } from '@/components/Spacing';
import { COLORS } from '@/constants/colors';
import { CoreStyle } from '@/styles/global';
import { emailSchema, usernameSchema } from '@/utils/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

const schema = yup.object({
  email: emailSchema,
  username: usernameSchema,
});

export default function LoginScreen() {
  const [shouldTriggerError, setShouldTriggerError] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      username: '',
    },
    mode: 'all',
    reValidateMode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = handleSubmit(
    async (formValues) => {
      console.log(formValues);
    },
    (_error) => setShouldTriggerError(true),
  );

  const renderFooter = useCallback(
    () => (
      <RN.View>
        <Button title={'Submit'} onPress={onSubmitHandler} />
        <Spacing />
      </RN.View>
    ),
    [onSubmitHandler],
  );

  return (
    <KeyboardAwareScrollView
      bounces={false}
      contentContainerStyle={CoreStyle.flexGrow1}
    >
      <Container
        style={styles.container}
        isScroll={true}
        Footer={renderFooter()}
        // backgroundColor={addAlpha(COLORS.white, 0.1)}
        // backgroundImageUri={
        //   'https://data.jigsawpuzzle.co.uk/ravensburger.5/london-jigsaw-puzzle-1000-pieces.81617-1.fs.jpg'
        // }
      >
        <RN.Text style={styles.title}>{'Sign In'}</RN.Text>

        <Spacing steps={3} />
        <RN.View g={10}>
          <FormInput
            control={control}
            name={'username'}
            placeholder={'Enter your username'}
            shouldTriggerError={shouldTriggerError}
          />
          <FormInput
            control={control}
            name={'email'}
            placeholder={'Enter your email'}
            shouldTriggerError={shouldTriggerError}
          />
        </RN.View>
      </Container>
    </KeyboardAwareScrollView>
  );
}

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: PoppinsFonts.Poppins_600,
    color: COLORS.orange,
    textAlign: 'center',
  },
});
