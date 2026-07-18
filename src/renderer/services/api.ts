const API_URL = import.meta.env.RENDERER_VITE_API_URL

class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private headers(hasBody: boolean): Record<string, string> {
    const h: Record<string, string> = {}
    if (hasBody) h['Content-Type'] = 'application/json'
    if (this.token) h['Authorization'] = this.token
    return h
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${path}`
    console.log(`[API] ${options.method || 'GET'} ${url}`)

    const res = await fetch(url, {
      ...options,
      headers: { ...this.headers(!!options.body), ...(options.headers as Record<string, string>) }
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const errMsg = body.message || `HTTP ${res.status}`
      console.error(`[API] Error: ${errMsg}`, body)
      throw new Error(errMsg)
    }

    const data = await res.json()
    console.log(`[API] Response OK from ${path}`)
    return data
  }

  async verifyToken(token: string) {
    return this.request<{ user: { _id: string; email: string; name?: string } }>(
      '/fn-execute/v1/auth/verify-token',
      { method: 'POST', body: JSON.stringify({ token }) }
    )
  }

  async getProjects() {
    return this.request<Project[]>('/fn-execute/v1/projects')
  }

  async getProject(resourceId: string) {
    return this.request<Project>(`/fn-execute/v1/projects/${resourceId}`)
  }

  async patchThemeConfig(resourceId: string, themeConfig: Record<string, unknown>) {
    return this.request<void>(`/fn-execute/v1/projects/${resourceId}/theme-config`, {
      method: 'PATCH',
      body: JSON.stringify({ theme_config: themeConfig })
    })
  }

  async uploadComponent(resourceId: string, data: {
    name: string
    category: string
    version: number
    bundle: string
    styles?: string
    props_schema?: object[]
  }) {
    return this.request<CustomComponentMeta>(`/fn-execute/v1/projects/${resourceId}/custom-components`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getCustomComponents(resourceId: string) {
    return this.request<CustomComponentMeta[]>(`/fn-execute/v1/projects/${resourceId}/custom-components`)
  }

  async deleteCustomComponent(resourceId: string, componentId: string) {
    return this.request<void>(`/fn-execute/v1/projects/${resourceId}/custom-components/${componentId}`, {
      method: 'DELETE'
    })
  }
}

export interface CustomComponentMeta {
  _id: string
  name: string
  category: string
  version: number
  bundle_url: string
  styles_url: string
  props_schema: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface Project {
  _id: string
  name: string
  status: 'active' | 'terminated' | 'deactive'
  owner?: { _id: string; email: string }
  theme_config?: {
    colors?: Record<string, string>
    fonts?: Record<string, unknown>
    environments?: Record<string, unknown>
  }
  pages?: { _id: string; name: string; slug: string }[]
  created_at?: string
  updated_at?: string
}

export const api = new ApiService()
