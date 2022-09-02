const users = [{
        id: 1,
        name: "Ivan",
        age: 23,
        phone: "12456345",
        password: "1111"
    },
    {
        id: 2,
        name: "Alexandr",
        age: 26,
        phone: "5545654",
        password: "2222"
    },
    {
        id: 3,
        name: "Petr",
        age: 24,
        phone: "66546464",
        password: "3333"
    },
    {
        id: 4,
        name: "Oksana",
        age: 20,
        phone: "77456477",
        password: "4444"
    },
    {
        id: 5,
        name: "Vera",
        age: 22,
        phone: "87556454",
        password: "5555"
    },
]

const getUser = (password) => {
    const result = users.find(item => item.password === password);
    if (result != undefined) {
        return result;
    }
    return null;
}

const getUserById = (id) => {
    const result = users.find(item => item.id == id);
    return result;
}

const getAllUsers = () => {
    return users;
}

module.exports = {
    getUser,
    getAllUsers,
    getUserById
}