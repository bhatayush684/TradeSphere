type User = { id: string; email: string };

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class AuthService {
  private mockUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    await delay(800);
    if (!email.endsWith('@example.com') || password.length < 6) {
      throw new Error('Invalid credentials');
    }
    this.mockUser = { id: 'u-1', email };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tsx_session', JSON.stringify(this.mockUser));
    }
    return this.mockUser;
  }

  async register(email: string, password: string): Promise<User> {
    await delay(1000);
    if (password.length < 8) {
      throw new Error('Password too short');
    }
    this.mockUser = { id: 'u-1', email };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tsx_session', JSON.stringify(this.mockUser));
    }
    return this.mockUser;
  }

  async forgotPassword(email: string): Promise<void> {
    await delay(700);
    if (!email.includes('@')) throw new Error('Email not found');
  }

  getCurrentUser(): User | null {
    if (this.mockUser) return this.mockUser;
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('tsx_session');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as User;
      this.mockUser = parsed;
      return parsed;
    } catch {
      return null;
    }
  }

  clearSession() {
    this.mockUser = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('tsx_session');
    }
  }
}

export const authService = new AuthService();

