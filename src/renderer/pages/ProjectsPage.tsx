import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api, type Project } from '../services/api'
import DashboardTemplate from '../templates/dashboard-template/DashboardTemplate'
import AppHeader, { AppLogo } from '../organisms/app-header/AppHeader'
import SearchBar from '../molecules/search-bar/SearchBar'
import ProjectCard from '../molecules/project-card/ProjectCard'
import Button from '../atoms/button/Button'
import Spinner from '../atoms/spinner/Spinner'
import Icon from '../atoms/icon/Icon'
import styles from './ProjectsPage.module.scss'

export default function ProjectsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return projects
    const q = search.toLowerCase()
    return projects.filter((p) => p.name?.toLowerCase().includes(q))
  }, [projects, search])

  const header = (
    <AppHeader
      left={
        <>
          <AppLogo />
          <h1 className={styles.pageTitle}>Projects</h1>
        </>
      }
      right={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/docs')}
            icon={<Icon name="book" size={16} />}
          >
            Docs
          </Button>
          <span className={styles.email}>{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </>
      }
    />
  )

  return (
    <DashboardTemplate header={header}>
      <div className={styles.searchBar}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />
      </div>

      <div className={styles.body}>
        {loading ? (
          <div className={styles.center}>
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className={styles.center}>
            <p className={styles.errorText}>{error}</p>
            <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.center}>
            <Icon name="folder" size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              {search ? 'No matching projects' : 'No projects found'}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((project) => (
              <ProjectCard
                key={project._id}
                name={project.name}
                status={project.status}
                pageCount={project.pages?.length}
                onClick={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardTemplate>
  )
}
