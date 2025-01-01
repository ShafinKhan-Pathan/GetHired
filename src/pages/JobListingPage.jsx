import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UseFetch from "@/hooks/Use-Fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
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
  const { fn: fnCompanies, data: companies } = UseFetch(getCompanies);
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);
  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />;
  }
  const handleSearch = (e) => {
    e.preventDefault(); // Stops the form from submitting and refreshing the page
    let formData = new FormData(e.target); // e.target refers to the form element that triggered the event, and FormData captures its data.
    const query = formData.get("search-query"); // Get the value of the "search-query" field from the form data.
    if (query) {
      setSearchQuery(query); // Update the search query state with the value of "query" using the hook.
    }
  };
  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
  };
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-8xl text-center pb-16">
        Latest Jobs
      </h1>
      {/* Add Filters here */}
      <form
        onSubmit={handleSearch}
        className="h-10 w-full flex gap-2 items-center mb-4"
      >
        <Input
          type="text"
          placeholder="Search Job By Title"
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button variant="blue" className="h-full sm:w-28" type="submit">
          Search
        </Button>
      </form>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter Jobs by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("US")?.map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter Jobs by Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies &&
                companies.map(({ name, id }) => {
                  return (
                    (
                      <SelectItem key={name} value={id}>
                        {" "}
                        {name}{" "}
                      </SelectItem>
                    ) || (
                      <SelectItem value="">No companies available</SelectItem>
                    )
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="destructive"
          onClick={clearFilters}
          className="sm:w-1/2"
        >
          Clear Filters
        </Button>
      </div>
      {loadingJobs && (
        <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />
      )}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
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
