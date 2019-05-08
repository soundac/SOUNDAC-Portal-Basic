import { Roles } from './roles';

export class User {

    constructor(id?: string, userName?: string, email?: string, password?: string, key?: string) {
        id ? this.id = id : this.id = null;
        userName ? this.userName = userName : this.userName = '';
        email ? this.email = email : this.email = '';
        password ? this.password = password : this.password = null;
        key ? this.key = key : this.key = null;
        this.roles = new Roles();
    }

    id: string;
    userName: string;
    email: string;
    password: string;
    key: string;
    roles: Roles;

}
