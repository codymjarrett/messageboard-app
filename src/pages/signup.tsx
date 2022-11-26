import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'

import { queryClient } from '../queryClient'
import axios from 'axios'
import { DEVELOPMENT_BASE_URL } from '../constants'

interface Values {
  username: string
  email: string
  password: string
}
interface Errors {
  username?: string
  email?: string
  password?: string
}

const validate = (values: Values) => {
  const errors: Errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 30) {
    errors.username = 'Must be 30 characters or less'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length > 30) {
    errors.password = 'Must be 30 characters or less'
  } else if (values.password.length < 6) {
    errors.password = 'Must be at least 6 characters long'
  }

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

export default function Signup() {
  const { mutate, isError, isLoading } = useMutation({
    mutationFn: (userCredentials: Values) => {
      return axios.post(DEVELOPMENT_BASE_URL + 'signup', userCredentials)
    },
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      const { username, password, email } = values
      mutate({ username, password, email })
      resetForm()
    },
  })

  console.log({ formik })

  return (
    <div className="w-9/12">
      <h1 className="text-2xl">Sign up</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-4">
          <label htmlFor="username" className="block">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="p-2 w-full"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.errors.username ? <div>{formik.errors.username}</div> : null}
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="p-2 w-full"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email ? <div>{formik.errors.email}</div> : null}
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="p-2 w-full"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? <div>{formik.errors.password}</div> : null}
        </div>
        <button
          type="submit"
          className=" bg-slate-800 hover:bg-slate-400 px-10 py-4 rounded mt-5 text-white"
          disabled={formik.isSubmitting || isLoading || !formik.isValid}
        >
          Sign up
        </button>
      </form>
      <div className="flex justify-center mt-11">
        Already a user?
        <Link
          href="/signin"
          className="ml-2 underline underline-offset-7 text-blue-600"
        >
          Log In
        </Link>
      </div>
    </div>
  )
}
