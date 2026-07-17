import { z } from 'zod'

// Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['M', 'F', 'Other']).optional(),
  nationality: z.string().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  personalPhone: z.string().optional(),
})

// Professional Information
export const professionalInfoSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  manager: z.string().optional(),
  joiningDate: z.string().min(1, 'Joining date is required'),
  contractType: z.enum(['Permanent', 'Contract', 'Temporary']).optional(),
  employmentStatus: z.enum(['Active', 'Inactive', 'On Leave']).optional(),
  officeLocation: z.string().optional(),
})

// Bank Details
export const bankDetailsSchema = z.object({
  accountHolder: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountType: z.enum(['Savings', 'Current']),
})

// Tax Information
export const taxInfoSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  aadharLastFour: z.string().regex(/^\d{4}$/, 'Aadhar last 4 digits only'),
  taxRegime: z.enum(['Old', 'New']),
})

// Emergency Contact
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional(),
})

// Education
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  graduationYear: z.string().regex(/^\d{4}$/, 'Valid year required'),
})

// Experience
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

// Skill
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Expert']),
})

// Certification
export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer name is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
})

// Profile Completion type
export const profileSchema = z.object({
  personalInfo: personalInfoSchema.partial(),
  professionalInfo: professionalInfoSchema.partial(),
  bankDetails: bankDetailsSchema.partial(),
  taxInfo: taxInfoSchema.partial(),
  emergencyContacts: z.array(emergencyContactSchema).default([]),
  education: z.array(educationSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type ProfessionalInfo = z.infer<typeof professionalInfoSchema>
export type BankDetails = z.infer<typeof bankDetailsSchema>
export type TaxInfo = z.infer<typeof taxInfoSchema>
export type EmergencyContact = z.infer<typeof emergencyContactSchema>
export type Education = z.infer<typeof educationSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Skill = z.infer<typeof skillSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Profile = z.infer<typeof profileSchema>
