export const enum Role {
  ADMIN = 'ADMIN',
}

export interface EventMember {
  id: string;
  name: string;
}

export class User implements EventMember {
  id: string;
  name: string;
  email: string;
  roles: Array<string>;

  constructor(name?: string, email?: string, roles?: Array<string>) {
    this.name = name;
    this.email = email;
    this.roles = roles;
  }
}
