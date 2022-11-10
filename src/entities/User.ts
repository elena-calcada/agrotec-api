class User {
  id: string;
  name: string;
  email: string;
  password: string;
  is_executor: boolean;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;

  private constructor({ name, email, password }: User) {
    return Object.assign(this, {
      name,
      email,
      password,
    });
  }
}

export { User };
