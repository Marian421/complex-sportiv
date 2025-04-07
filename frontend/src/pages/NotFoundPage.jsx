import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
    <div>
        404 Not Found
        <Link to={"/"}>Go back to home page</Link>
    </div>
    );
}

export default NotFoundPage;