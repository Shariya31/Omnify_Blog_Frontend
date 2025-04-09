import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { userNotExist } from "../slices/userReducer";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(false);

    const toggleMenu = () => {
        setOpen(!open);
        setMobileDropdown(false); // close dropdown when toggling mobile menu
    };

    const userData = JSON.parse(localStorage.getItem("userData"));
    const name = userData?.user?.name || "";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(userNotExist());
        navigate("/");
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Blogify
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
                    <Link
                        className="relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-gray-600 before:transition-all before:duration-300 hover:before:w-full"
                        to="/"
                    >
                        Home
                    </Link>

                    {userData?.token && (
                        <Link
                            className="relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-gray-600 before:transition-all before:duration-300 hover:before:w-full"
                            to="/blogs"
                        >
                            Blogs
                        </Link>
                    )}

                    <Link
                        className="relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-gray-600 before:transition-all before:duration-300 hover:before:w-full"
                        to="/signup"
                    >
                        Signup
                    </Link>

                    {name ? (
                        <div className="relative">
                            <p
                                onClick={() => setDropdown((prev) => !prev)}
                                className="cursor-pointer relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-gray-600 before:transition-all before:duration-300 hover:before:w-full"
                            >
                                {name}
                            </p>
                            {dropdown && (
                                <div className="absolute bg-white border shadow-lg mt-2 rounded-md right-0 w-40 z-10">
                                    <button
                                        onClick={() => {
                                            setDropdown(false);
                                            navigate("/post");
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Post Blog
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            className="relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-gray-600 before:transition-all before:duration-300 hover:before:w-full"
                            to="/login"
                        >
                            Login
                        </Link>
                    )}

                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    {open ? (
                        <X className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
                    ) : (
                        <Menu className="w-6 h-6 cursor-pointer" onClick={toggleMenu} />
                    )}
                </div>
            </div>

            {/* Mobile Nav */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
                    }`}
            >
                <nav className="px-4 space-y-3 flex flex-col text-gray-700 font-medium">
                    <Link
                        to="/"
                        onClick={toggleMenu}
                        className="hover:underline"
                    >
                        Home
                    </Link>

                    {userData?.token && (
                        <Link
                            to="/blogs"
                            onClick={toggleMenu}
                            className="hover:underline"
                        >
                            Blogs
                        </Link>
                    )}

                    {name ? (
                        <div>
                            <button
                                onClick={() => setMobileDropdown((prev) => !prev)}
                                className="text-left hover:underline"
                            >
                                {name}
                            </button>
                            {mobileDropdown && (
                                <div className="ml-4 mt-1 flex flex-col gap-1 ease-in-out duration-700">
                                    <button
                                        className="text-left text-sm hover:bg-gray-100 px-2 py-1"
                                        onClick={() => {
                                            setMobileDropdown(false);
                                            toggleMenu();
                                            navigate("/post");
                                        }}
                                    >
                                        Post Blog
                                    </button>
                                    <button
                                        className="text-left text-sm hover:bg-gray-100 px-2 py-1"
                                        onClick={() => {
                                            setMobileDropdown(false);
                                            toggleMenu();
                                            handleLogout();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" onClick={toggleMenu} className="hover:underline">
                            Login
                        </Link>
                    )}

                    <Link
                        to="/signup"
                        onClick={toggleMenu}
                        className="hover:underline"
                    >
                        Signup
                    </Link>

                    {userData?.token && (
                        <button
                            className="text-left hover:bg-gray-100"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
