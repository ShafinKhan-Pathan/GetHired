import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, saveJob } from "@/api/apiJobs";
import UseFetch from "@/hooks/Use-Fetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobAction = () => {},
}) => {
  const { user } = useUser();
  const [saved, setSaved] = useState(savedInit);
  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = UseFetch(saveJob, {
    alreadySaved: saved,
  });

  const handleSavedJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };
  const { loading: loadingDeleteJob, fn: fnDeleteJob } = UseFetch(deleteJob, {
    job_id: job.id,
  });
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };
  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);
  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          {job.title}
          {!isMyJob && (
            <Trash2Icon
              fill="red"
              size={20}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}
      </CardContent>
      <CardFooter className="flex gap-5 items-center">
        <Link to={`/job/${job.id}`}>
          <Button variant="secondary" className="w-full">
            More Information
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSavedJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart
                size={20}
                stroke="red"
                fill="red"
                className="transform transition-transform duration-200 hover:scale-150 cursor-pointer"
              />
            ) : (
              <Heart
                size={20}
                className="transform transition-transform duration-200 hover:scale-150 cursor-pointer"
              />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
