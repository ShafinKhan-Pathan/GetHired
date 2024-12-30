import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import UseFetch from "@/hooks/Use-Fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();
  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = UseFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });
  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-8xl text-center pb-16">
        Latest Jobs
      </h1>
      {/* Add Filters here */}
      {loadingJobs && (
        <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />
      )}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard key={job.id} job={job} savedInit={job?.saved?.length>0} />;
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListingPage;
