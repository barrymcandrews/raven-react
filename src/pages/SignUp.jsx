import React, {useState} from 'react';
import {Auth} from 'aws-amplify'
import {useHistory} from "react-router-dom";
import {Link} from 'react-router-dom';
import {useFormik} from "formik";
import * as Yup from 'yup';

export default function SignUp({signIn}) {
  const [message, setMessage] = useState('');

  let history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required.'),
      email: Yup.string()
        .email('Email is invalid.')
        .required('Email is required.'),
      password: Yup.string()
        .required('Password is required.')
        .matches(/^.{8,}$/, 'Password must be at least 8 characters.')
        .matches(/^.*[A-Z].*$/, 'Password must contain an uppercase letter.')
        .matches(/^.*[a-z].*$/, 'Password must contain an lowercase letter.')
        .matches(/^.*[0-9].*$/, 'Password must contain a number.')
        .matches(/^.*[@$!%*#?&].*$/, 'Password must contain one these symbols: @$!%*#?&'),
      passwordConfirmation: Yup.string()
        .required('You must confirm your password.')
        .oneOf([Yup.ref('password'), null], 'Passwords must match.'),
    }),
    onSubmit: handleSubmit,
  });

  function handleSubmit(values) {
    Auth.signUp({
      username: values.username,
      password: values.password,
      attributes: {email: values.email}
    }).then((result) => {
        history.replace('/verify-user/' + values.username);
    }).catch((err) => {
      if (err.name === 'UsernameExistsException') {
        formik.errors.username = 'A user with that username already exists.';
      } else {
        console.log(err);
        setMessage('An unknown error occurred.');
      }
      formik.setSubmitting(false);
    });
  }

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="on" className="flex">
      <div className="w-375 flex-col">
        <div className="main-content">
          <div className="text-center text-md">Sign Up</div>
          <p className="text-center msg-label text-sm error">{message}</p>

          <div className="input-label text-sm">Username:</div>
          <div className="flex-row">
            <input
              autoComplete="username"
              type="text"
              autoCapitalize="off"
              {...formik.getFieldProps('username')}
            />
          </div>
          {formik.touched.username && formik.errors.username &&
            <p className="hint-label error">{formik.errors.username}</p>
          }

          <div className="input-label text-sm">Email:</div>
          <div className="flex-row">
            <input autoComplete="email" type="text" {...formik.getFieldProps('email')}/>
          </div>
          {formik.touched.email && formik.errors.email &&
            <p className="hint-label error">{formik.errors.email}</p>
          }

          <div className="input-label text-sm">Password:</div>
          <div className="flex-row">
            <input type="password" autoComplete="new-password" {...formik.getFieldProps('password')}/>
          </div>
          {formik.touched.password && formik.errors.password &&
            <p className="hint-label error">{formik.errors.password}</p>
          }

          <div className="input-label text-sm">Confirm Password:</div>
          <div className="flex-row">
            <input type="password" autoComplete="new-password" {...formik.getFieldProps('passwordConfirmation')}/>
          </div>
          {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation &&
            <p className="hint-label error">{formik.errors.passwordConfirmation}</p>
          }

          <div className="flex-row">
            <button className="login-button" type="submit">Create New Account</button>
          </div>
          <div className="m-5 text-center text-sm">Already have an account? <Link to="/login">Log In</Link></div>
        </div>
      </div>
    </form>
  );
}


