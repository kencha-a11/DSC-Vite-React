import { Link } from "react-router-dom";

export default function Forbidden() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>403</h1>
            <h2>Forbidden</h2>
            <p>The page you are looking for is restricted.</p>
            <Link to="/dashboard">Go Back Home</Link>
        </div>
    );
}
