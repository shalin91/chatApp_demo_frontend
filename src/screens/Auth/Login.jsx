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
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../redux/auth/authSlice';
import Toast from 'react-native-toast-message';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });
    }

    if (isSuccess || user) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully',
      });
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

  const handleLogin = (values) => {
    dispatch(login(values));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
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
                      touched.password && errors.password && styles.inputError,
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
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      isLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>LOGIN</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 48,
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
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: 8,
  },
  forgotText: {
    color: '#007bff',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#80bdff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signupText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Login;

