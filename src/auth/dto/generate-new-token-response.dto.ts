

export class GenerateNewTokenResponse{

  id: string;
  email: string;
  roles: string[];
  newAccessToken: string

  constructor(data: any, newAccessToken: string) {
    this.id = data.id;
    this.email = data.email;
    this.roles = data.roles;
    this.newAccessToken = newAccessToken;
  }
}