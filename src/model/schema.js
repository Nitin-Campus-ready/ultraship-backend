import { employees as employeeData } from "../data/data.js";
import { requireAdmin } from "../statergies/jwt-stratergies.js";

export const typeDefs = `#graphql
  enum SortDirection {
    ASC
    DESC
  }

  enum EmployeeSortField {
    NAME
    AGE
    ATTENDANCE
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String
    subjects: [String!]!
    attendance: Int!
    department: String
    roleTitle: String
    email: String!
    phone: String
    location: String
    salary: Int! # admin-only field in UI logic
  }

  input EmployeeFilterInput {
    nameContains: String
    minAge: Int
    maxAge: Int
    class: String
    department: String
  }

  type EmployeeConnection {
    items: [Employee!]!
    totalCount: Int!
    page: Int!
    pageSize: Int!
  }

  input AddEmployeeInput {
    name: String!
    age: Int!
    class: String
    subjects: [String!]!
    attendance: Int!
    department: String
    roleTitle: String
    email: String!
    phone: String
    location: String
    salary: Int!
  }

  input UpdateEmployeeInput {
    name: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Int
    department: String
    roleTitle: String
    email: String
    phone: String
    location: String
    salary: Int
  }

  type Query {
    employees(
      filter: EmployeeFilterInput
      page: Int = 1
      pageSize: Int = 10
      sortBy: EmployeeSortField = NAME
      sortDirection: SortDirection = ASC
    ): EmployeeConnection!

    employee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(input: AddEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
  }
`;

let employees = [...employeeData];

function applyFilter(list, filter) {
  if (!filter) return list;
  let result = [...list];

  if (filter.nameContains) {
    const term = filter.nameContains.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(term));
  }

  if (filter.minAge != null) {
    result = result.filter((e) => e.age >= filter.minAge);
  }

  if (filter.maxAge != null) {
    result = result.filter((e) => e.age <= filter.maxAge);
  }

  if (filter.class) {
    result = result.filter((e) => e.class === filter.class);
  }

  if (filter.department) {
    result = result.filter((e) => e.department === filter.department);
  }

  return result;
}

function applySort(list, sortBy, sortDirection) {
  const dir = sortDirection === "DESC" ? -1 : 1;
  return [...list].sort((a, b) => {
    let valA, valB;
    switch (sortBy) {
      case "AGE":
        valA = a.age;
        valB = b.age;
        break;
      case "ATTENDANCE":
        valA = a.attendance;
        valB = b.attendance;
        break;
      case "NAME":
      default:
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
    }
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });
}

export const resolvers = {
  Query: {
    employees: (_, args) => {
      const {
        filter,
        page = 1,
        pageSize = 10,
        sortBy = "NAME",
        sortDirection = "ASC",
      } = args;

      let result = applyFilter(employees, filter);
      result = applySort(result, sortBy, sortDirection);

      const totalCount = result.length;
      const offset = (page - 1) * pageSize;
      const items = result.slice(offset, offset + pageSize);

      return {
        items,
        totalCount,
        page,
        pageSize,
      };
    },

    employee: (_, { id }) => {
      return employees.find((e) => e.id === id) || null;
    },
  },

  Mutation: {
    addEmployee: (_, { input }, { user }) => {
      requireAdmin(user);

      const newEmployee = {
        id: String(employees.length + 1),
        ...input,
      };
      employees.push(newEmployee);
      return newEmployee;
    },

    updateEmployee: (_, { id, input }, { user }) => {
      requireAdmin(user);

      const index = employees.findIndex((e) => e.id === id);
      if (index === -1) throw new Error("Employee not found");

      employees[index] = {
        ...employees[index],
        ...input,
      };
      return employees[index];
    },
  },
};
