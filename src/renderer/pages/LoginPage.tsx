import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthTemplate from '../templates/auth-template/AuthTemplate'
import Button from '../atoms/button/Button'
import Spinner from '../atoms/spinner/Spinner'
import Icon from '../atoms/icon/Icon'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
  const { token, login, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/projects', { replace: true })
  }, [token, navigate])

  return (
    <AuthTemplate>
      <div className={styles.card}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>CS</div>
          <h1 className={styles.title}>Component Studio</h1>
          <p className={styles.subtitle}>
            Build, preview, and test your custom components locally
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={login}
          disabled={loading}
          icon={loading ? <Spinner size="sm" /> : <Icon name="external-link" size={20} />}
        >
          Sign in with your Blinkpage account
        </Button>

        <p className={styles.hint}>
          You will be redirected to sign in via your browser
        </p>
      </div>
    </AuthTemplate>
  )
}
