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
