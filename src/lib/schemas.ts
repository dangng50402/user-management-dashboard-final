import { z } from "zod";

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "Tên ít nhất 2 ký tự")
    .max(50, "Tối đa 50 ký tự")
    .trim(),

  username: z
    .string()
    .min(3, "Username ít nhất 3 ký tự")
    .max(20, "Tối đa 20 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ, số và _"),

  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .toLowerCase()
    .pipe(z.email("Email không hợp lệ")),

  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Số điện thoại không hợp lệ"),

  // Không dùng z.url() vì JSONPlaceholder trả về "hildegard.org" không có https://
  website: z
    .string()
    .min(1, "Website là bắt buộc"),

  address: z.object({
    city: z
      .string()
      .min(1, "Thành phố là bắt buộc")
      .max(50, "Tối đa 50 ký tự"),
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const userFormDefaultValues: UserFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  address: {
    city: "",
  },
};

// Login schema — tách riêng, không liên quan đến userFormSchema
export const loginSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;