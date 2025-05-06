"use client"
import {useState} from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function Resources() {
	const [activeToastUrl, setActiveToastUrl] = useState<string | null>(null);

	const handleCopy = (copyLink: string) => {
	navigator.clipboard.writeText(copyLink);
	// set the active url to whatever has been copied
	setActiveToastUrl(copyLink);
	// whichever card uses that url will show the copied toast
	setTimeout(() => setActiveToastUrl(null), 3000);
	};
	
	return (
		<div className="flex flex-col text-center gap-y-5 mx-6 w-full h-fullpt-1">
			<h2 className="text-left text-2xl mt-8">Wildfire Preparedness</h2>
			<div className="flex flex-wrap gap-x-10 gap-y-10"> 
				{/* Resource Card */}
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1a.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Assembling your Wildfire-Ready Kit
							</h2>
							<p className="text-sm text-gray-700">
								Be proactive with a well-prepared emergency supply kit.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://readyforwildfire.org/prepare-for-wildfire/emergency-supply-kit/" && (
						<div className="toast text-black text-sm mt-2 text-red-950">
							<p>Link copied to clipboard!</p>
						</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource1b.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">American Red Cross</p>
						<a href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/wildfire.html?srsltid=AfmBOopRTJ8Nh58i4OClG0bJSb908NNxzmBSkWNO0695k2hdOEJruFdf">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								What Should You Do Before a Wildfire Starts?
							</h2>
							<p className="text-sm text-gray-700">
								More people are living in areas at risk for wildfires, but we can take action to prepare.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/wildfire.html?srsltid=AfmBOopRTJ8Nh58i4OClG0bJSb908NNxzmBSkWNO0695k2hdOEJruFdf")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/wildfire.html?srsltid=AfmBOopRTJ8Nh58i4OClG0bJSb908NNxzmBSkWNO0695k2hdOEJruFdf" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource1c.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">National Weather Service</p>
						<a href="https://www.weather.gov/safety/wildfire-ready">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Home Preparedness
							</h2>
							<p className="text-sm text-gray-700">
								Take personal responsibility and prepare long before the threat of a wildland 
								fire so your home is ready in case of a fire
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.weather.gov/safety/wildfire-ready")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.weather.gov/safety/wildfire-ready" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1d.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Southern California Edison</p>
						<a href="https://www.sce.com/wildfire/wildfire-mitigation-efforts?ecid=ppc~ggl~psps~mkt~res~40125~%epid!&gclsrc=aw.ds&gad_source=1&gad_campaignid=22398918419&gbraid=0AAAAABWg2-JvrXhxpqfcehLjRnpHwH-Pe&gclid=Cj0KCQjww-HABhCGARIsALLO6XwioIxcCpUaQOSB1bmU7EChdiJfn8acczvA9SnT0cKm1iiHvFbDjE0aAnTSEALw_wcB">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Wildfire Mitigation Efforts
							</h2>
							<p className="text-sm text-gray-700">
							Working to help prevent wildfires by strengthening our electrical system. 
							Over time, this work will reduce the need to implement Public Safety Power Shutoff (PSPS) outages in high fire risk areas and help minimize the number of affected customers.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.sce.com/wildfire/wildfire-mitigation-efforts?ecid=ppc~ggl~psps~mkt~res~40125~%epid!&gclsrc=aw.ds&gad_source=1&gad_campaignid=22398918419&gbraid=0AAAAABWg2-JvrXhxpqfcehLjRnpHwH-Pe&gclid=Cj0KCQjww-HABhCGARIsALLO6XwioIxcCpUaQOSB1bmU7EChdiJfn8acczvA9SnT0cKm1iiHvFbDjE0aAnTSEALw_wcB")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.sce.com/wildfire/wildfire-mitigation-efforts?ecid=ppc~ggl~psps~mkt~res~40125~%epid!&gclsrc=aw.ds&gad_source=1&gad_campaignid=22398918419&gbraid=0AAAAABWg2-JvrXhxpqfcehLjRnpHwH-Pe&gclid=Cj0KCQjww-HABhCGARIsALLO6XwioIxcCpUaQOSB1bmU7EChdiJfn8acczvA9SnT0cKm1iiHvFbDjE0aAnTSEALw_wcB" && (
						<div className="toast text-black text-sm mt-2 text-red-950">
							<p>Link copied to clipboard!</p>
						</div>
						)}
					</div>
				</div>
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1e.webp" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">National Interagency Fire Center</p>
						<a href="https://www.nifc.gov/fire-information">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								National Wildland Fire Preparedness Levels
							</h2>
							<p className="text-sm text-gray-700">
								The National Interagency Fire Center (NIFC) is the nation’s support center for wildland fires and other emergency situations.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.nifc.gov/fire-information")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.nifc.gov/fire-information" && (
						<div className="toast text-black text-sm mt-2 text-red-950">
							<p>Link copied to clipboard!</p>
						</div>
						)}
					</div>
				</div>
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource1f.avif" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">National Interagency Fire Center</p>
						<a href="https://www.dnr.wa.gov/publications/rp_fire_how_to_prepare_wildfire.pdf">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								How to Prepare for a Wildfire
							</h2>
							<p className="text-sm text-gray-700">
							How to protect yourself
							and your property, and details the steps to take now so that
							you can act quickly when you, your home, or your business is
							in danger.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.dnr.wa.gov/publications/rp_fire_how_to_prepare_wildfire.pdf")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.dnr.wa.gov/publications/rp_fire_how_to_prepare_wildfire.pdf" && (
						<div className="toast text-black text-sm mt-2 text-red-950">
							<p>Link copied to clipboard!</p>
						</div>
						)}
					</div>
				</div>
			</div>
			<h2 className="text-left text-2xl mt-8">Wildire Survival</h2>
			<div className="flex flex-wrap gap-x-10 gap-y-10"> 
				{/* Resource Card */}
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource2a.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">California State Parks</p>
						<a href="https://www.parks.ca.gov/?page_id=30661">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Wildfire Safety Tips
							</h2>
							<p className="text-sm text-gray-700">
							Whether you are an experienced outdoor enthusiast or a new one, California State Parks looks forward to seeing you at 
							California’s park trails, beaches, mountains, and deserts but ask that you recreate responsibly.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.parks.ca.gov/?page_id=30661")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.parks.ca.gov/?page_id=30661" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource2b.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ruidoso New Mexico Gov</p>
						<a href="https://www.ruidoso-nm.gov/wildfire-safety-tips">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Everything you need to know to protect you, your family and property during a wildfire 
							</h2>
							<p className="text-sm text-gray-700">
							Knowing what to do in the event of a wildfire can help save your life and property.  
							Learn how to protect you, your family and property during a rural fire with these essential wildfire safety tips.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.ruidoso-nm.gov/wildfire-safety-tips")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.ruidoso-nm.gov/wildfire-safety-tips" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource2c.png" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready.GOV</p>
						<a href="https://www.ready.gov/wildfires">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Wildfires
							</h2>
							<p className="text-sm text-gray-700">
							Wildfires are unplanned fires that burn in natural areas like forests, grasslands or prairies. 
							These dangerous fires spread quickly and can devastate not only wildlife and natural areas, but also communities.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.ready.gov/wildfires")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.ready.gov/wildfires" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
						<div className="p-4">
							
						</div>
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource2d.webp" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Los Angeles Fire Department</p>
						<a href="https://lafd.org/ready-set-go#:~:text=Create%20a%20Wildfire%20Action%20Plan,important%20evacuation%20and%20contact%20information.">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Ready, Set, Go!
							</h2>
							<p className="text-sm text-gray-700">
								If there is an active wildfire in your area, you need to be prepared before it’s time to Go!
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://lafd.org/ready-set-go#:~:text=Create%20a%20Wildfire%20Action%20Plan,important%20evacuation%20and%20contact%20information.")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://lafd.org/ready-set-go#:~:text=Create%20a%20Wildfire%20Action%20Plan,important%20evacuation%20and%20contact%20information." && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource2e.webp" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">USDA.GOV</p>
						<a href="https://www.climatehubs.usda.gov/sites/default/files/A%20Guide%20to%20Staying%20Safe%20During%20Wildfires_1.pdf">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Guide to Staying Safe During Wildfires
							</h2>
							<p className="text-sm text-gray-700">
								The bad news is that wildfires can be incredibly destructive and deadly. The even worse news: They’re
								poised to wreak more havoc in the years to come.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.climatehubs.usda.gov/sites/default/files/A%20Guide%20to%20Staying%20Safe%20During%20Wildfires_1.pdf")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.climatehubs.usda.gov/sites/default/files/A%20Guide%20to%20Staying%20Safe%20During%20Wildfires_1.pdf" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource2f.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Idaho Firewise</p>
						<a href="https://idahofirewise.org/evacuation/if-you-get-trapped/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Evacuation If You Get Trapped
							</h2>
							<p className="text-sm text-gray-700">
								Wildfires are unpredictable, and even the best-laid plans can go amiss. 
								If you find yourself trapped by a wildfire, you can take steps to increase your chances of survival. 
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://idahofirewise.org/evacuation/if-you-get-trapped/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://idahofirewise.org/evacuation/if-you-get-trapped/" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<h2 className="text-left text-2xl mt-8">Wildfire Response</h2>
			<div className="flex flex-wrap gap-x-10 gap-y-10 "> 
				{/* Resource Card */}
				<div className="max-w-xs text-left bg-white rounded-2xl shadow-md">
					<img 
						src="/images/resource3a.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/post-wildfire/after-a-wildfire/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								After a Wildfire
							</h2>
							<p className="text-sm text-gray-700">
								From damage assessment to future planning, get all the advice you need to recover from a wildfire.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://readyforwildfire.org/post-wildfire/after-a-wildfire/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://readyforwildfire.org/post-wildfire/after-a-wildfire/" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource3b.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Ready for Wildfire</p>
						<a href="https://readyforwildfire.org/post-wildfire/returning-home/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Returning Home Checklist
							</h2>
							<p className="text-sm text-gray-700">
								The danger doesn’t end when the wildfire is extinguished. The aftermath can present various hazards, 
								from flash flooding and debris flows to structural instability and compromised trees.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://readyforwildfire.org/post-wildfire/returning-home/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://readyforwildfire.org/post-wildfire/returning-home/" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource3c.webp" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Wildfire Risk to communities</p>
						<a href="https://wildfirerisk.org/reduce-risk/wildfire-response/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Community Tools for Wildfire Response
							</h2>
							<p className="text-sm text-gray-700">
								As wildfires grow in frequency and size, responding will increasingly rely on organization, communication, and risk-based management tools.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://wildfirerisk.org/reduce-risk/wildfire-response/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://wildfirerisk.org/reduce-risk/wildfire-response/" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource3d.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">California Environmental Protection Agency</p>
						<a href="https://calepa.ca.gov/disaster/fire/">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Fire Response and Recovery
							</h2>
							<p className="text-sm text-gray-700">
								CalEPA and its departments assist local, state and federal agencies during and after major wildfires.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://calepa.ca.gov/disaster/fire/")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://calepa.ca.gov/disaster/fire/" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource3e.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">California Fire Foundation</p>
						<a href="https://www.cafirefoundation.org/what-we-do/for-communities/disaster-relief">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Wildfire & Disaster Relief
							</h2>
							<p className="text-sm text-gray-700">
								The California Fire Foundation is working with local fire agencies and community-based organizations to provide direct 
								financial support to impacted residents as details of the damage emerge. 
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.cafirefoundation.org/what-we-do/for-communities/disaster-relief")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.cafirefoundation.org/what-we-do/for-communities/disaster-relief" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
				<div className="max-w-xs bg-white text-left rounded-2xl shadow-md">
					<img 
						src="/images/resource3f.jpg" 
						alt="Evacuation Essentials"
						className="w-full object-cover rounded-t-2xl"
					/>
					<div className="p-4">
						<p className="text-sm text-gray-600 uppercase tracking-wide mb-2">California Department of Public Health</p>
						<a href="https://www.cdph.ca.gov/Programs/EPO/CDPH%20Document%20Library/Wildfire%20Cleanup%20Considerations%20for%20California%27s%20Public%20Health%20Officials%20%28August%202019%29.pdf">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Wildfire Cleanup
							</h2>
							<p className="text-sm text-gray-700">
								To help provide a resource for Local Health Officers involved
								in debris management in their jurisdiction, this document contains specific measures to that must be taken.
							</p>
						</a>
						<button
							onClick={() => handleCopy("https://www.cdph.ca.gov/Programs/EPO/CDPH%20Document%20Library/Wildfire%20Cleanup%20Considerations%20for%20California%27s%20Public%20Health%20Officials%20%28August%202019%29.pdf")}
							className="mt-3 text-sm text-red-700 hover:text-red-600"
						>
							Copy Link
						</button>
						{/* Custom Toast for the link copy */
						activeToastUrl === "https://www.cdph.ca.gov/Programs/EPO/CDPH%20Document%20Library/Wildfire%20Cleanup%20Considerations%20for%20California%27s%20Public%20Health%20Officials%20%28August%202019%29.pdf" && (
							<div className="toast text-black text-sm mt-2 text-red-950">
								<p>Link copied to clipboard!</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
		
	  );
}