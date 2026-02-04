import User from "../Models/User.js";
import Counter from "../Models/Counter.js";
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

    // Get next employeeId
    let counter = await Counter.findOneAndUpdate(
      { id: "employeeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // If counter just started (below 10000), initialize it to 10000
    if (counter.seq < 10000) {
      counter = await Counter.findOneAndUpdate(
        { id: "employeeId" },
        { $set: { seq: 10000 } },
        { new: true }
      );
    }

    const employeeId = counter.seq.toString();

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
      employeeId,
    });

    // Send email with credentials
    const message = `Welcome to the team, ${name}!\n\nYour account has been created by the Admin.\n\nEmployee ID: ${employeeId}\nEmail: ${email}\nPassword: ${password}\nDesignation: ${designation}\nDepartment: ${category}\nReporting Manager: ${reportingManager}\n\nPlease login and change your password.`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4f46e5;">Welcome to the team, ${name}!</h1>
        <p>Your account has been created by the Admin.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Employee ID:</strong> ${employeeId}</p>
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
          employeeId: employee.employeeId,
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
        employeeId: employee.employeeId,
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

/**
 * @desc    Toggle employee activation status
 * @route   PATCH /api/admin/employees/:id/toggle-status
 * @access  Private (Admin only)
 */
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    const statusText = employee.isActive ? "Activated" : "Deactivated";
    
    // Send email notification
    const subject = `Account ${statusText}`;
    const message = `Hello ${employee.name},\n\nYour account (Employee ID: ${employee.employeeId}) has been ${statusText.toLowerCase()} by the Admin.\n\nStatus: ${statusText}\n\nIf you have any questions, please contact the IT department.`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: ${employee.isActive ? '#10b981' : '#ef4444'};">Account ${statusText}</h2>
        <p>Hello ${employee.name},</p>
        <p>Your employee account has been <strong>${statusText.toLowerCase()}</strong> by the Admin.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 0;"><strong>Employee ID:</strong> ${employee.employeeId || 'N/A'}</p>
          <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: ${employee.isActive ? '#10b981' : '#ef4444'}; font-bold: true;">${statusText}</span></p>
        </div>
        <p>If you have any questions regarding this action, please contact your reporting manager or the administration department.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: employee.email,
        subject,
        message,
        html
      });
    } catch (emailError) {
      console.error("Failed to send status notification email:", emailError);
      // We don't return error here because the status was actually updated in DB
    }

    res.status(200).json({
      success: true,
      message: `Employee ${statusText.toLowerCase()} successfully`,
      data: {
        id: employee._id,
        isActive: employee.isActive
      }
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc    Delete a user/employee
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
