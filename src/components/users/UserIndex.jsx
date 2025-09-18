import react, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function IndexUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/users")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
            });
    }, []);

    return (
        <div>
            <h1>Index User Component</h1>
            {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}

            {users.map((user) => (
                <div key={user.id}>
                    <Link to={`/users/show/${user.id}`}>User: {user.name}</Link>
                    <p>Email: {user.email}</p>
                </div>
            ))}
        </div>
    );
}