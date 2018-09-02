/* Não é legal deixar a senha no frontend,
para isso, foi criado esse AuthData.
Para mexer apenas com requisições auth do backend */
export interface AuthData {
  email: string;
  password: string;
}
