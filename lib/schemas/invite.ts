import { z } from 'zod'

export const inviteEmployeeSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
      'Please enter a valid phone number'
    ),
  
  designation: z
    .string()
    .min(1, 'Please select a designation'),
  
  department: z
    .string()
    .optional(),
  
  date_of_joining: z
    .string()
    .min(1, 'Date of joining is required')
    .refine(
      (date) => {
        const selected = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selected >= today
      },
      'Date of joining must be today or in the future'
    ),
})

export type InviteEmployeeFormData = z.infer<typeof inviteEmployeeSchema>
