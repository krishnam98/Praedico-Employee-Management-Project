// Static Employee Data for Demonstration
export type EmployeeType = "Regular" | "Temporary";
export type TemporaryType = "Intern" | "Contract" | null;
export type EmployeeCategory = "HR" | "Finance" | "Engineering" | "Marketing" | "Operations" | "Sales";
export type EmployeeDesignation =
  | "Manager"
  | "Senior Developer"
  | "Junior Developer"
  | "HR Executive"
  | "Finance Analyst"
  | "Marketing Specialist"
  | "Sales Representative"
  | "Operations Coordinator";

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  category: EmployeeCategory;
  designation: EmployeeDesignation;
  employeeType: EmployeeType;
  temporaryType: TemporaryType;
  joinDate: string;
  department: string;
  phone: string;
  address: string;
  reportingManager?: string;
}

// Sample Employee Data
export const CURRENT_EMPLOYEE: Employee = {
  id: "EMP001",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@praedico.com",
  avatar: "/avatars/employee-face.png",
  category: "Engineering",
  designation: "Senior Developer",
  employeeType: "Regular",
  temporaryType: null,
  joinDate: "2023-01-15",
  department: "Software Development",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India"
};

// Alternative employee profiles for testing
export const SAMPLE_EMPLOYEES: Employee[] = [
  CURRENT_EMPLOYEE,
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@praedico.com",
    avatar: "/avatars/employee-2.png",
    category: "HR",
    designation: "HR Executive",
    employeeType: "Regular",
    temporaryType: null,
    joinDate: "2022-06-10",
    department: "Human Resources",
    phone: "+91 98765 43211",
    address: "Delhi, India"
  },
  {
    id: "EMP003",
    name: "Amit Patel",
    email: "amit.patel@praedico.com",
    avatar: "/avatars/employee-3.png",
    category: "Finance",
    designation: "Finance Analyst",
    employeeType: "Regular",
    temporaryType: null,
    joinDate: "2023-03-20",
    department: "Finance & Accounting",
    phone: "+91 98765 43212",
    address: "Bangalore, Karnataka, India"
  },
  {
    id: "EMP004",
    name: "Sneha Reddy",
    email: "sneha.reddy@praedico.com",
    avatar: "/avatars/employee-4.png",
    category: "Engineering",
    designation: "Junior Developer",
    employeeType: "Temporary",
    temporaryType: "Intern",
    joinDate: "2024-01-05",
    department: "Software Development",
    phone: "+91 98765 43213",
    address: "Hyderabad, Telangana, India"
  },
  {
    id: "EMP005",
    name: "Vikram Singh",
    email: "vikram.singh@praedico.com",
    avatar: "/avatars/employee-5.png",
    category: "Marketing",
    designation: "Marketing Specialist",
    employeeType: "Temporary",
    temporaryType: "Contract",
    joinDate: "2024-02-01",
    department: "Marketing & Communications",
    phone: "+91 98765 43214",
    address: "Pune, Maharashtra, India"
  }
];

// Helper function to get employee type display text
export const getEmployeeTypeDisplay = (employee: Employee): string => {
  if (employee.employeeType === "Regular") {
    return "Regular Employee";
  }
  return `Temporary - ${employee.temporaryType}`;
};

// Helper function to check if employee has limited access
export const hasLimitedAccess = (employee: Employee): boolean => {
  return employee.employeeType === "Temporary";
};
