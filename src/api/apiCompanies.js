import supabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error: error } = await supabase.from("companies").select("*");

  if (error) {
    console.log("Error Fetching Companies Details : ", error);
    return null;
  }
  return data;
}
