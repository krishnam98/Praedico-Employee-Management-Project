import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../Utils/sendEmail.js";

/**
 * @desc    Register a new employee by Admin
 * @route   POST /api/admin/employees/register
 * @access  Private (Admin only)
 */
export const registerEmployee = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      designation, 
      category, 
      employeeType, 
      temporaryType, 
      phoneNumber, 
      reportingManager 
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      designation,
      category,
      employeeType,
      temporaryType,
      phoneNumber,
      reportingManager,
    });

    // Send email with credentials
    const message = `Welcome to the team, ${name}!\n\nYour account has been created by the Admin.\n\nEmail: ${email}\nPassword: ${password}\nDesignation: ${designation}\nDepartment: ${category}\nReporting Manager: ${reportingManager}\n\nPlease login and change your password.`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4f46e5;">Welcome to the team, ${name}!</h1>
        <p>Your account has been created by the Admin.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Designation:</strong> ${designation}</p>
          <p><strong>Department:</strong> ${category}</p>
          <p><strong>Reporting Manager:</strong> ${reportingManager}</p>
        </div>
        <p>Please login and change your password.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: employee.email,
        subject: "Your Employee Account Credentials",
        message,
        html,
      });
    } catch (err) {
      console.error("Email could not be sent", err);
      // We still return success as user is created, but with a warning
      return res.status(201).json({
        success: true,
        message: "Employee created but email could not be sent",
        data: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Employee registered and credentials sent via email",
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Register Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Get all employees
 * @route   GET /api/admin/employees
 * @access  Private (Admin only)
 */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" }).select("-password");
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
