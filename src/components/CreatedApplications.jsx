import { getApplications } from "@/api/apiApplications";
import UseFetch from "@/hooks/Use-Fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user } = useUser();
  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = UseFetch(getApplications, {
    user_id: user.id,
  });
  useEffect(() => {
    fnApplications();
  }, []);
  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />;
  }
  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} isCandidate/>
            );
          })}
    </div>
  );
};

export default CreatedApplications;
