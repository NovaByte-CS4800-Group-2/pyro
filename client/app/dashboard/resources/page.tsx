"use client"

export default function Dashboard() {
	return (
		<div className="max-sm flex  space-y-6 mx-6 w-full h-full pt-1 mt-0">
			<div>
				<h1 className = "text-3xl mt-5">Resources Page</h1>
				<div className=" max-w-sm bg-white space-6 rounded-2xl shadow-md mt-20 object-cover w-1/2 h-1/2">
					<img 
						src="/images/resource1.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"/>

					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Evacuation Essentials
							</h2>
							<p className="text-sm text-gray-700 flex-row overflow-hidden">
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