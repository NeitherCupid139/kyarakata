import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

	// Close sidebar on route change on mobile
	useEffect(() => {
		setSidebarOpen(false);
	}, [location.pathname]);

	return (
		<div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
			{/* Sidebar for mobile */}
			<div
				className={`${
					sidebarOpen ? "block" : "hidden"
				} fixed inset-0 z-40 flex md:hidden`}
				role="dialog"
				aria-modal="true"
			>
				{/* Backdrop */}
				<div
					className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
					aria-hidden="true"
					onClick={() => setSidebarOpen(false)}
				></div>

				{/* Sidebar component */}
				<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
					<div className="absolute top-0 right-0 -mr-12 pt-2">
						<button
							type="button"
							className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							onClick={() => setSidebarOpen(false)}
						>
							<span className="sr-only">Close sidebar</span>
							<svg
								className="h-6 w-6 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<Sidebar />
				</div>

				<div className="flex-shrink-0 w-14" aria-hidden="true">
					{/* Dummy element to force sidebar to shrink to fit close icon */}
				</div>
			</div>

			{/* Static sidebar for desktop */}
			<div className="hidden md:flex md:flex-shrink-0">
				<div className="flex flex-col w-64">
					<div className="flex flex-col h-0 flex-1">
						<Sidebar />
					</div>
				</div>
			</div>

			{/* Content area */}
			<div className="flex flex-col w-0 flex-1 overflow-hidden">
				<Header setSidebarOpen={setSidebarOpen} />

				<main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default DashboardLayout;
