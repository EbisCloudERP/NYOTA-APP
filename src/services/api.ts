import { getToken } from "./storage";

const BASE_URL = "https://training-admin.ebisclouderp.com/api/v1";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  otp: string;
}

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  gender: string;
  date_of_birth: string;
  education_level: string | null;
  employment_status: string;
  roles: unknown[];
  is_onboarded: boolean;
  last_login_at: string;
}

interface LoginOtpResponse {
  user: AuthUser;
  token: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(
      json.message || `Request failed with status ${response.status}`
    );
  }

  return json;
}

export async function login(
  contact: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  const isEmail = contact.includes("@");
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({
      type: isEmail ? "email" : "phone",
      contact,
      password,
    }),
  });
}

export async function loginOtp(otp: string): Promise<ApiResponse<LoginOtpResponse>> {
  return request<LoginOtpResponse>("/login_otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

interface VerifyEmailResponse {
  exists: boolean;
  otp?: string;
}

export async function verifyEmail(
  contact: string,
  coName: string,
  coNumber: string
): Promise<ApiResponse<VerifyEmailResponse>> {
  return request<VerifyEmailResponse>("/verify-email", {
    method: "POST",
    body: JSON.stringify({
      type: "email",
      contact,
      co_name: coName,
      co_number: coNumber,
    }),
  });
}

interface VerifyCreateAccountOtpResponse {
  user: AuthUser;
  token: string;
}

export async function verifyCreateAccountOtp(
  email: string,
  otp: string
): Promise<ApiResponse<VerifyCreateAccountOtpResponse>> {
  return request<VerifyCreateAccountOtpResponse>("/verify-email-otp", {
    method: "POST",
    body: JSON.stringify({ contact: email, otp }),
  });
}

export interface SubCounty {
  id: number;
  county_id: number;
  constituency_name: string;
  ward: string;
  alias: string;
}

export interface County {
  id: number;
  county_name: string;
  sub_counties: SubCounty[];
}

export async function getCounties(): Promise<ApiResponse<County[]>> {
  return request<County[]>("/counties");
}

export interface EligibilityOption {
  id: number;
  question_id: number;
  label: string;
  value: string;
  order: number;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface EligibilityQuestion {
  id: number;
  key: string;
  question: string;
  description: string;
  type: string;
  is_required: boolean;
  order: number;
  metadata: unknown;
  options: EligibilityOption[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getEligibilityQuestions(): Promise<ApiResponse<EligibilityQuestion[]>> {
  return request<EligibilityQuestion[]>("/onboarding/eligibility_questions");
}

export async function submitEligibilityAnswers(
  uuid: string,
  answers: Record<string, string | string[]>
): Promise<ApiResponse<unknown>> {
  return request("/onboarding/eligibility_answers", {
    method: "POST",
    body: JSON.stringify({ uuid, answers }),
  });
}

interface RegisterRequest {
  first_name: string;
  middle_name: string;
  last_name: string;
  national_id: string;
  type: string;
  contact: string;
  county: string;
  sub_county: string;
  password: string;
  password_confirmation: string;
}

export async function registerUser(
  data: RegisterRequest
): Promise<ApiResponse<unknown>> {
  return request("/register_request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

const EMAIL_BASE_URL = "https://ebis.ebisclouderp.com/api/general-email";

interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  company_name: string;
}

export async function sendEmail(params: EmailParams): Promise<unknown> {
  const response = await fetch(EMAIL_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Email failed with status ${response.status}`);
  }

  return response.json();
}

export async function sendEmailOtp(email: string, otp: string): Promise<void> {
  await sendEmail({
    name: email.split("@")[0],
    email,
    subject: "Your NYOTA Verification Code",
    message: `Your verification code is: ${otp}`,
    company_name: "NYOTA",
  });
}

const SMS_BASE_URL = "https://sms.ebisclouderp.com/api/sms/sendsms";

interface SmsResult {
  status_code: string;
  status_desc: string;
  message_id: number;
  mobile_number: string;
  network_id: string;
  message_cost: number;
  credit_balance: number;
}

export async function sendSms(
  mobile: string,
  message: string
): Promise<SmsResult[]> {
  const response = await fetch(SMS_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      api_key: "cnaGrv6lg1Z0zQeR3AusWYxkfmCdbIBJ579hViLTtNDEFjyX2H",
      service_id: 0,
      mobile,
      response_type: "json",
      shortcode: "EBISCLOUD",
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`SMS failed with status ${response.status}`);
  }

  const json = await response.json();

  if (Array.isArray(json) && json[0]?.status_code !== "1000") {
    throw new Error(json[0]?.status_desc || "SMS sending failed");
  }

  return json;
}
