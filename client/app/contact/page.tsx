'use client'
export default function Contact() {
    return (
      <>
        <div className="bg-[--greige-mist] flex-grow min-h-full pb-10 pl-2 pr-2">
          <div className="gap-y-5 flex flex-col items-stretch pt-10 m-auto w-auto self-center max-w-[900px]">
            <h1 className="text-3xl font-bold text-center font-display"> Contact Us Page </h1>
            <p className="text-center text-[--deep-moss] mt-2 font-normal">We would love to hear back from you! Feel free to reach out or ask any questions <br/>
                (maybe create a google form that lets them write a review?? idk) </p>
            
            <h2 className="text-2xl font-semibold font-display ">Our Team</h2>
            <div className="flex flex-col items-center gap-y-8 mt-6">
                {/* will fix the order later, CEO then the rest of us, etc.. */}
                <div className="flex justify-center gap-x-12">
                    {/* arin */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-full bg-[--ash-olive] overflow-hidden">
                            <img src="/images/sample.jpg" alt="Arin Boyadjian" className="w-full h-full object-cover" />
                        </div>
                        <p className="font-display text-lg">Arin Boyadjian</p>
                    </div>

                    {/* ana */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-full bg-[--ash-olive] overflow-hidden">
                            <img src="/images/sample.jpg" alt="arin" className="w-full h-full" />
                        </div>
                        <p className="font-display text-lg">Anastasia Davis</p>
                    </div>

                    {/* natalie */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-full bg-[--ash-olive] overflow-hidden">
                            <img src="/images/sample.jpg" alt="arin" className="w-full h-full" />
                        </div>
                        <p className="font-display text-lg">Natalie Mamikonyan</p>
                    </div>
                </div>

                <div className="flex justify-center gap-x-12"> 
                    {/* jess */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-full bg-[--ash-olive] overflow-hidden">
                            <img src="/images/sample.jpg" alt="arin" className="w-full h-full" />
                        </div>
                        <p className="font-display text-lg">Jessica Pinto</p>
                    </div>

                    {/* hadya */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-full bg-[--ash-olive] overflow-hidden">
                            <img src="/images/sample.jpg" alt="arin" className="w-full h-full" />
                        </div>
                        <p className="font-display text-lg">Hadya Rohin</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 font-display">Company Info</h2>
            <div className="mt-4 space-y-2">
                <p>Email: <a href="mailto:contact@novabyte.com" className="text-[--olive-stone] underline">contact@novabyte.com</a></p>
                <p>Website: <a href="https://novabyte-cs4800-group-2.github.io/NovaByte-website/index.html" className="text-[--olive-stone] underline" target="_blank">NovaByte</a></p>
                <p>Address: </p>
                <p>Review form: </p>
            </div>
          </div>
        </div>
      </>
    );
  }