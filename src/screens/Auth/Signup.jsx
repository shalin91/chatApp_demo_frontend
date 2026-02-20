import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/auth/authSlice';
import Toast from 'react-native-toast-message';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Signup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: message,
      });
    }

    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully. Please login.',
      });
      navigation.navigate('Login');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, navigation]);

  const handleSignup = (values) => {
    // Backend expects 'name', current form has 'name' in schema
    dispatch(register(values));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              <View style={styles.headerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>
              </View>

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSignup}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={styles.formContainer}>
                    <View
                      style={[
                        styles.inputContainer,
                        touched.name && errors.name && styles.inputError,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={24}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                      />
                    </View>
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <View
                      style={[
                        styles.inputContainer,
                        touched.email && errors.email && styles.inputError,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={24}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />
                    </View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <View
                      style={[
                        styles.inputContainer,
                        touched.password &&
                          errors.password &&
                          styles.inputError,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={24}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <MaterialCommunityIcons
                          name={
                            showPassword ? 'eye-off-outline' : 'eye-outline'
                          }
                          size={24}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <View
                      style={[
                        styles.inputContainer,
                        touched.confirmPassword &&
                          errors.confirmPassword &&
                          styles.inputError,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="lock-check-outline"
                        size={24}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                      />
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.signupButton,
                        isLoading && styles.buttonDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.signupButtonText}>SIGN UP</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginTop: 12,
    marginBottom: 32,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    paddingBottom: 8,
  },
  inputError: {
    borderBottomColor: '#ff4d4d',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 40,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#80bdff',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Signup;

