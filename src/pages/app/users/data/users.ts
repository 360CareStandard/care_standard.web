import { faker } from "@faker-js/faker";

export const users = Array.from({ length: 20 }, () => {
  const sex = faker.person.sexType(); // 'male' | 'female'
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    gender: sex, // or capitalize if you prefer: sex === 'male' ? 'Male' : 'Female'
    email: faker.internet.email({ firstName }).toLowerCase(),
    phoneNumber: faker.phone.number({ style: "international" }),
    status: faker.helpers.arrayElement([
      "active",
      "inactive",
      "invited",
      "suspended",
    ]),
    role: faker.helpers.arrayElement([
      "superadmin",
      "admin",
      "cashier",
      "manager",
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
});
