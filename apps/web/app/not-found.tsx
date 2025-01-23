import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center font-semibold bg-background text-text">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/" replace>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;