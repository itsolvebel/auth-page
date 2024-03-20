'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { fetcher } from 'app/lib/fetcher'
import { FetchingError } from 'app/lib/errors'

type LoginForm = {
  email_or_username: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState<LoginForm>({
    email_or_username: '',
    password: '',
  })
  const [activeBullet, setActiveBullet] = useState(1)
  const [sliderPosition, setSliderPosition] = useState<number>(0)
  const [requirements, setRequirements] = useState<string[]>([''])

  async function login(form: LoginForm) {
    const options: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return await fetcher.post('/login', form, options)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
      .then(res => {
        const url = 'https://app.itsolve.be'
        router.push(url)
      })
      .catch(error => {
        if (error instanceof FetchingError) {
          if (error.statusCode === 401) {
            toast.error('Wrong email/username or password')
          }
          return
        }
        toast.error('Something went wrong!')
      })
  }

  const checkPasswordStrength = (value: string) => {
    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasDigit = /\d/.test(value)
    const hasSpecialChar = /[@$!%*?&]/.test(value)
    const isLengthValid = value.length >= 8

    let newSliderPosition = 0
    let newRequirements: string[] = []

    if (value === '') {
      return { newSliderPosition, newRequirements }
    }

    if (!hasUppercase) {
      newRequirements.push(
        '😖 Weak. Must contain 8 characters, 1 digit, 1 symbol'
      )
    } else if (!hasLowercase) {
      newRequirements.push('😐 So-so. Must contain at least 1 letter')
    } else {
      newSliderPosition = 40

      if (!hasDigit) {
        newRequirements.push('😋 Almost. Must contain at least 1 digit')
      } else {
        newSliderPosition = 60

        if (!hasSpecialChar) {
          newRequirements.push('😎 Awesome. Must contain special symbol')
        } else {
          newSliderPosition = 80

          if (!isLengthValid) {
            newRequirements.push('🚀 Great! Perfect password')
          } else {
            newRequirements.push('🚀 Great! Perfect password')
            newSliderPosition = 100
          }
        }
      }
    }

    setSliderPosition(newSliderPosition)
    setRequirements(newRequirements)
  }

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newPassword: string = e.target.value
    setForm(prevForm => ({ ...prevForm, password: newPassword }))
    checkPasswordStrength(newPassword)
  }

  const [isSignUpMode, setSignUpMode] = useState(false)

  const toggleSignUpMode = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('toggleSignUpMode is called')
    setSignUpMode(prevMode => !prevMode)
  }

  const moveSlider = (index: number) => {
    setActiveBullet(index)
    switch (index) {
      case 1:
        setText('Create your own courses')
        break
      case 2:
        setText('Customize as you like')
        break
      case 3:
        setText('Invite students to your class')
        break
      default:
        setText('')
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextBullet = (activeBullet % 3) + 1
      moveSlider(nextBullet)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [activeBullet])

  const bulletArray = [1, 2, 3]
  const [text, setText] = useState('Create your own courses')

  return (
    <main className={isSignUpMode ? 'sign-up-mode' : ''}>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form
              action="index.html"
              autoComplete="off"
              className="sign-in-form"
            >
              <div className="logo">
                <img
                  src="./assets/logo.png"
                  alt="easyclassName"
                  className="w-100 h-100"
                />
              </div>
              <div className="heading">
                <h2>Log in to your account</h2>
                <h6>Not registered yet?</h6>
                <a href="#" className="toggle" onClick={toggleSignUpMode}>
                  Sign up
                </a>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    type="text"
                    minLength={4}
                    autoComplete="off"
                    id="email_or_username"
                    onChange={handleOnChange}
                    required
                  />
                  <label>Username/email</label>
                </div>

                <div className="input-wrap">
                  <input
                    type="password"
                    minLength={4}
                    autoComplete="off"
                    id="password"
                    onChange={handleOnChange}
                    required
                  />

                  <label>Password</label>
                </div>

                <input
                  type="submit"
                  value="Sign In"
                  className="sign-btn"
                  onClick={handleOnSubmit}
                />

                <div className="different-login">
                  <p>or</p>
                </div>

                <div className="input-wrap">
                  <button type="button" className="login-with-google-btn">
                    Sign in with Google
                  </button>
                </div>

                <p className="text">
                  Forgotten your password or you login datails?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </form>

            <form
              action="index.html"
              autoComplete="off"
              className="sign-up-form"
            >
              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" className="toggle" onClick={toggleSignUpMode}>
                  Sign in
                </a>
              </div>

              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    type="text"
                    minLength={4}
                    autoComplete="off"
                    required
                  />
                  <label>Username</label>
                </div>

                <div className="input-row">
                  <div className="input-wrap">
                    <input
                      type="text"
                      minLength={4}
                      autoComplete="off"
                      required
                    />
                    <label>First Name</label>
                  </div>

                  <div className="input-wrap">
                    <input
                      type="text"
                      minLength={4}
                      autoComplete="off"
                      required
                    />
                    <label>Last Name</label>
                  </div>
                </div>

                <div className="input-wrap">
                  <input type="email" autoComplete="off" required />
                  <label>Email</label>
                </div>

                <div className="input-wrap-2">
                  <input
                    type="password"
                    minLength={4}
                    autoComplete="off"
                    onChange={handlePasswordChange}
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="container">
                  <div
                    className="requirements-container"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '8px',
                    }}
                  >
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        style={{
                          color: 'green',
                          fontSize: '0.8rem',
                          paddingTop: '2px',
                        }}
                      >
                        {requirement}
                      </div>
                    ))}
                    <div
                      style={{
                        width: `${sliderPosition}%`,
                        height: '6px',
                        backgroundColor:
                          sliderPosition >= 66.7
                            ? 'green'
                            : sliderPosition >= 33.3
                            ? 'yellow'
                            : 'red',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                </div>

                <input type="submit" value="Sign Up" className="sign-btn" />

                <div className="different-login">
                  <p>or</p>
                </div>

                <div className="input-wrap">
                  <button type="button" className="login-with-google-btn">
                    Sign in with Google
                  </button>
                </div>

                <p className="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          <div className="carousel">
            <div className="images-wrapper">
              <img
                src={`./assets/image${activeBullet}.png`}
                className={`image img-${activeBullet} show`}
                alt=""
              />
            </div>

            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>{text}</h2>
                </div>
              </div>

              <div className="bullets">
                {bulletArray.map((bullet, index) => (
                  <span
                    key={index}
                    className={`bullets ${
                      bullet === activeBullet ? 'active' : ''
                    }`}
                    onClick={() => moveSlider(bullet)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
