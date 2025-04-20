"use client"

export default function Dashboard() {
	return (
		<div className="flex flex-col items-center gap-y-20 mx-6 w-full h-full pt-1">
			<h1 className = "text-3xl mt-5">Resources Page</h1>
			<div className="flex flex-wrap gap-x-20 gap-y-20">
				{/* Resource Card */}
				<div className="max-w-sm bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Evacuation Essentials
							</h2>
							<p className="text-sm text-gray-700">
								Understand the true burden imposed by loss—in money, lost time, poorer health,
								damaged productivity and lowered job security. This is some more information to test how much text can fit in the box.
							</p>
						</a>
					</div>
				</div>
				<div className="max-w-sm bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Evacuation Essentials
							</h2>
							<p className="text-sm text-gray-700">
								Understand the true burden imposed by loss—in money, lost time, poorer health,
								damaged productivity and lowered job security. This is some more information to test how much text can fit in the box.
							</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	  );
}