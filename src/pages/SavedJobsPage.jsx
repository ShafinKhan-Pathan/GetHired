import { getSavedJobs } from '@/api/apiJobs'
import JobCard from '@/components/JobCard'
import UseFetch from '@/hooks/Use-Fetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const SavedJobsPage = () => {
  const {isLoaded, user} = useUser()
  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs
  } = UseFetch(getSavedJobs)
  useEffect(()=>{
    if(isLoaded) fnSavedJobs()
  }, [isLoaded])
  if(!isLoaded || loadingSavedJobs){
    return <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />
  }


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-8xl text-center pb-16">
        Saved Jobs
      </h1>
      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            savedJobs.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved.job}
                  savedInit={true}
                  onJobAction={fnSavedJobs}
                />
              );
            })
          ) : (
            <div>No Saved Jobs Found 👀</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedJobsPage