import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="w-full py-8 px-8">
      <div className="max-w-7xl mx-auto flex justify-end gap-12">
        <Link 
          to="/" 
          className="text-primary hover:text-primary/80 transition-colors font-medium text-lg"
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className="text-primary hover:text-primary/80 transition-colors font-medium text-lg"
        >
          About us
        </Link>

        <Link 
          to="/contact" 
          className="text-primary hover:text-primary/80 transition-colors font-medium text-lg"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
