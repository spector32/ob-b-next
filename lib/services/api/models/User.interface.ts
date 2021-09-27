import RecordModel from ".";

interface User extends RecordModel {
    name?: string;
    email: string;
    password?: string;
}

export default User;
