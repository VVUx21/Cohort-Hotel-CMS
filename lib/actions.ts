import { schema } from "@/lib/schema";
import db from "@/lib/db/db";

const signUp = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedData = schema.parse({ email, password });
  await db.user.create({
    data: {
      email: validatedData.email.toLocaleLowerCase(),
      password: validatedData.password,
    },
  });
};

export { signUp };