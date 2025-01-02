import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import UseFetch from "@/hooks/Use-Fetch";
import { getCompanies } from "@/api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Compant" }),
  requirements: z.string().min(1, { message: "Requirements is required" }),
});
const PostJobsPage = () => {
  const { isLoaded, user } = useUser();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });
  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = UseFetch(getCompanies);
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);
  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#D3D3D3" />;
  }
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form className="flex flex-col gap-4 pb-0 p-4">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <div className="flex gap-2 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
                            <SelectItem value="">
                              No companies available
                            </SelectItem>
                          )
                        );
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Add Compant Drawer */}
        </div>
      </form>
    </div>
  );
};

export default PostJobsPage;
