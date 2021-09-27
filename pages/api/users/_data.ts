import faker from "faker";

const users: Record<string, unknown>[] = ((items: number) => {
    const users = [];
    for (let i = 0; i < items - 1; i++) {
        users.push({
            id: i,
            email: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
        });
    }
    users.push({
        id: users.length,
        email: "dev@dev.com",
        password: "dev@dev.com",
        name: "Developer User",
        phone: "911",
    });
    return users;
})(100);

export default users;
