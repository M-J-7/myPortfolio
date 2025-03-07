import { CERTIFICATE } from "../constants";

const Certificate = () => {
  return (
    <div className="border-b border-neutral-900 pb-4">
      <h1 className="my-20 text-center text-4xl">Certification</h1>
      <div>
        {CERTIFICATE.map((certificate, index) => (
          <div
            key={index}
            className="mb-8 flex flex-wrap lg:justify-center"
          >
            {/* Year Section */}
            {/* <div className="w-full lg:w-1/4">
              <p className="mb-2 text-sm text-neutral-400">
                {certificate.year}
              </p>
            </div> */}

            {/* Role and Details Section */}
            <div className="w-full max-w-xl lg:w-3/4">
              <h6 className="mb-2 font-semibold">
                <span className="text-white">{certificate.title}</span> - <span className="text-neutral-500">{certificate.company}</span>
              </h6>
              <p className="mb-4 text-neutral-400">{certificate.description}</p>
              {certificate.technologies.map((tech, index) => (
                <span key={index} className="mr-2 mt-4 rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-orange-700">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
