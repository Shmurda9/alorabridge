import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Define your secure master admin credentials here
  const adminEmail = "prestigegoldbullion@gmail.com";
  const rawPassword = "@Mhizlambo217"; // Change this to your preferred password

  console.log("Checking for existing administrative accounts...");
  const existingUser = await prisma.user.findFirst({
    where: { email: adminEmail }
  });

  if (existingUser) {
    console.log(`An account with the email ${adminEmail} already exists.`);
    return;
  }

  // Securely hash the password before saving to database
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName: "Workspace",
      lastName: "Director",
      role: "ADMIN", // Ensures your backend auth pipeline recognizes the authority tier
    },
  });

  console.log("=========================================");
  console.log("   ADMIN ACCOUNT CREATED SUCCESSFULLY!   ");
  console.log("=========================================");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${rawPassword}`);
  console.log("=========================================");
}

main()
  .catch((e) => {
    console.error("Error seeding administrator account:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });