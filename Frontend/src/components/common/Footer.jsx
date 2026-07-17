import { Link } from "react-router-dom";

export const Footer = () => {
    const github = import.meta.env.VITE_GITHUB_URL;
    const linkedin = import.meta.env.VITE_LINKEDIN_URL;
    const instagram = import.meta.env.VITE_INSTAGRAM_URL;

    return (
        <footer className="footer footer-horizontal footer-center bg-base-200 dark:bg-neutral text-base-content dark:text-neutral-content border-t border-base-300 dark:border-neutral-focus p-10 transition-colors duration-200">


            <nav className="grid grid-flow-col gap-6 font-medium text-sm">
                <Link to="/about" className="link link-hover hover:text-primary dark:hover:text-secondary-content transition-colors">About Us</Link>
                <Link to="/contact" className="link link-hover hover:text-primary dark:hover:text-secondary-content transition-colors">Contact Support</Link>
                <Link to="/shipping" className="link link-hover hover:text-primary dark:hover:text-secondary-content transition-colors">Shipping & Returns</Link>
                <Link to="/terms" className="link link-hover hover:text-primary dark:hover:text-secondary-content transition-colors">Privacy Policy</Link>
            </nav>


            <nav>
                <div className="grid grid-flow-col gap-6">

                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary dark:hover:text-secondary-content hover:scale-110 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                className="fill-current"
                            >
                                <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.096 3.292 9.423 7.86 10.95.575.106.785-.25.785-.556 0-.274-.01-1-.016-1.962-3.198.695-3.873-1.542-3.873-1.542-.523-1.328-1.278-1.682-1.278-1.682-1.044-.714.08-.699.08-.699 1.155.082 1.763 1.186 1.763 1.186 1.026 1.757 2.692 1.249 3.348.955.104-.743.402-1.249.731-1.536-2.553-.29-5.238-1.277-5.238-5.683 0-1.255.448-2.281 1.183-3.086-.119-.29-.513-1.46.112-3.045 0 0 .965-.309 3.162 1.179a10.98 10.98 0 0 1 5.756 0c2.196-1.488 3.16-1.179 3.16-1.179.626 1.585.232 2.755.114 3.045.737.805 1.182 1.831 1.182 3.086 0 4.417-2.689 5.389-5.25 5.673.413.355.781 1.056.781 2.13 0 1.538-.014 2.778-.014 3.156 0 .309.207.668.79.555C20.21 21.419 23.5 17.094 23.5 12 23.5 5.648 18.352.5 12 .5z"/>
                            </svg>
                        </a>
                    )}

                    {linkedin && (
                        <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary dark:hover:text-secondary-content hover:scale-110 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                className="fill-current"
                            >
                                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM0 8h5v16H0V8zm7.5 0h4.79v2.19h.07c.67-1.27 2.3-2.61 4.74-2.61C22.14 7.58 24 10.09 24 14.25V24h-5v-8.45c0-2.01-.04-4.6-2.8-4.6-2.81 0-3.24 2.2-3.24 4.46V24h-5V8z"/>
                            </svg>
                        </a>
                    )}

                    {instagram && (
                        <a
                            href={instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary dark:hover:text-secondary-content hover:scale-110 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                className="fill-current"
                            >
                                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm8.75 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                            </svg>
                        </a>
                    )}

                </div>
            </nav>

        
            <aside className="text-xs opacity-70">
                <p>Copyright © {new Date().getFullYear()} - All rights reserved by <span className="font-bold text-primary dark:text-secondary-content">ShopFix</span> Ltd</p>
            </aside>

        </footer>
    );
};