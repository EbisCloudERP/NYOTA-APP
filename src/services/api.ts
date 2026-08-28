import { router } from "expo-router";
import { clearSession, getToken } from "./storage";

const BASE_URL = "https://training-admin.ebisclouderp.com/api/v1";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponse {
  otp: string;
  uuid?: string;
  email?: string;
  phone?: string | null;
}

interface AuthUser {
  uuid: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  county: string | null;
  sub_county: string | null;
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

  if (response.status === 401 || /unauthenticated/i.test(json.message || "")) {
    await clearSession();
    router.replace("/login");
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok || !json.success) {
    const base =
      json.message || `Request failed with status ${response.status}`;
    const details = json.errors
      ? `\n${typeof json.errors === "string"
          ? json.errors
          : JSON.stringify(json.errors, null, 2)}`
      : "";
    throw new Error(`${base}${details}`);
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

export async function loginOtp(
  otp: string,
  uuid: string
): Promise<ApiResponse<LoginOtpResponse>> {
  return request<LoginOtpResponse>("/login_otp", {
    method: "POST",
    body: JSON.stringify({ otp, uuid }),
  });
}

interface VerifyEmailResponse {
  exists: boolean;
  otp?: string;
}

export async function verifyPhone(
  contact: string
): Promise<ApiResponse<VerifyEmailResponse>> {
  return request<VerifyEmailResponse>("/verify-email", {
    method: "POST",
    body: JSON.stringify({
      type: "mobile",
      contact,
    }),
  });
}

export async function verifyEmail(
  contact: string
): Promise<ApiResponse<VerifyEmailResponse>> {
  return request<VerifyEmailResponse>("/verify-email", {
    method: "POST",
    body: JSON.stringify({
      type: "email",
      contact,
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

export async function resetPassword(
  type: string,
  contact: string,
  password: string,
  password_confirmation: string
): Promise<ApiResponse<unknown>> {
  return request("/password_reset", {
    method: "POST",
    body: JSON.stringify({ type, contact, password, password_confirmation }),
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
  options: EligibilityOption[] | null;
  q_options: EligibilityOption[];
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

interface RegisterResponse {
  message: string;
  step: unknown;
}

export async function registerUser(
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> {
  return request<RegisterResponse>("/register_request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface CourseCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  type: string;
}

export interface Course {
  id: number;
  instructor_id: number | null;
  category_id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string | null;
  thumbnail: string | null;
  preview_video: string | null;
  level: string;
  status: string;
  access_type: string;
  duration_minutes: number;
  total_lessons: number;
  completion_rate: string;
  avg_rating: string;
  enrolled_count: number;
  certificate_enabled: number;
  passing_score: number;
  category: CourseCategory | null;
  lessons: CourseLesson[];
}

export interface HomepageSection {
  key: string;
  title: string;
  description: string;
  courses: Course[];
  type: string;
}

export interface CourseRecommendations {
  courses?: Course[];
  suggested_courses?: Course[];
  homepage_sections?: HomepageSection[];
  suggested_tags: unknown;
  related_lessons: unknown[];
  profile_incomplete: boolean;
}

export async function getCourseRecommendations(
  uuid: string
): Promise<ApiResponse<CourseRecommendations>> {
  return request<CourseRecommendations>("/course/user_recommendations", {
    method: "POST",
    body: JSON.stringify({ uuid }),
  });
}

export interface CatalogueLesson {
  id: number;
  title: string;
  type: string;
  duration_minutes: number;
  is_preview: boolean;
  content: unknown;
}

export interface CatalogueCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  status: string;
  duration_minutes: number;
  total_lessons: number;
  completed_lessons: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  lessons: CatalogueLesson[];
}

export async function getCourseCatalogue(): Promise<ApiResponse<CatalogueCourse[]>> {
  return request<CatalogueCourse[]>("/course/catalogue");
}

export async function getEnrolledCourses(): Promise<ApiResponse<CatalogueCourse[]>> {
  return request<CatalogueCourse[]>("/course/enrolled_courses");
}

export interface CourseDetailLesson {
  id: number;
  title: string;
  type: string;
  duration_minutes: number;
  is_preview: boolean;
  content: unknown;
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  status: string;
  duration_minutes: number;
  total_lessons: number;
  completed_lessons: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  enrollment: {
    status: string;
  };
  progress: {
    total: number;
    completed: number;
    current_lesson: {
      id: number;
      title: string;
      order: number;
    } | null;
    percentage: number;
  };
  lessons: CourseDetailLesson[];
}

export async function getCourse(slug: string): Promise<ApiResponse<CourseDetail>> {
  return request<CourseDetail>(`/course/${encodeURIComponent(slug)}`);
}

export interface LessonContent {
  type: string;
  embed_url: string | null;
  pdf_url: string | null;
  content: string | null;
  metadata: unknown;
}

export interface LessonVideo {
  id: number;
  url: string;
  mux_asset_id: string;
  mux_playback_id: string;
  status: string;
}

export interface QuizOption {
  id: number;
  option_text: string;
  order: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  explanation: string | null;
  points: number;
  options: QuizOption[];
}

export interface LessonQuiz {
  id: number;
  title: string;
  description: string | null;
  pass_mark: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  questions_count: number;
  questions: QuizQuestion[];
}

export interface LessonDetail {
  id: number;
  title: string;
  description: string | null;
  type: string;
  duration_minutes: number;
  order: number;
  is_preview: boolean;
  is_required: boolean;
  content: LessonContent | null;
  videos: LessonVideo[];
  quizz: LessonQuiz[];
  course: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    level: string;
    status: string;
    duration_minutes: number;
    total_lessons: number;
    completed_lessons: number | null;
    lessons: CourseDetailLesson[];
  } | null;
}

export async function getLesson(
  lessonId: string | number,
): Promise<ApiResponse<LessonDetail>> {
  return request<LessonDetail>(`/lesson/${encodeURIComponent(String(lessonId))}`);
}

export async function completeLesson(
  lessonId: string | number,
  uuid: string,
): Promise<ApiResponse<unknown>> {
  return request("/course/lesson/complete", {
    method: "POST",
    body: JSON.stringify({ lesson_id: String(lessonId), uuid }),
  });
}

export interface ExamOption {
  id: number;
  question_id: number;
  option_text: string;
  order: number;
}

export interface ExamQuestion {
  id: number;
  question: string;
  type: string;
  points: number;
  pivot: {
    quiz_id: number;
    question_id: number;
    order: number;
    points: number | null;
  };
  options: ExamOption[];
}

export interface Exam {
  id: number;
  title: string;
  description: string | null;
  type: string;
  pass_mark: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  is_active: boolean;
  questions: ExamQuestion[];
}

export async function getExams(
  uuid: string,
  courseId: string | number,
): Promise<ApiResponse<Exam>> {
  return request<Exam>("/course/exams", {
    method: "POST",
    body: JSON.stringify({ uuid, course_id: String(courseId) }),
  });
}

export interface ExamSubmissionAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  selected_option_ids: string;
  text_answer: string | null;
  is_correct: boolean;
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export interface ExamSubmissionResult {
  id: number;
  user_id: number;
  quiz_id: number;
  attempt_number: number;
  score: number;
  total_points: number;
  percentage: string;
  passed: boolean;
  status: string;
  started_at: string;
  completed_at: string | null;
  next_attempt_at: string | null;
  created_at: string;
  updated_at: string;
  answers: ExamSubmissionAnswer[];
}

export async function submitExam(
  uuid: string,
  examId: string | number,
  answers: Record<number, number>,
): Promise<ApiResponse<ExamSubmissionResult>> {
  const answerPayload: Record<string, string> = {};
  Object.entries(answers).forEach(([questionId, optionId]) => {
    answerPayload[questionId] = String(optionId);
  });

  return request<ExamSubmissionResult>("/course/exams/submit", {
    method: "POST",
    body: JSON.stringify({
      uuid,
      exam_id: String(examId),
      answers: answerPayload,
    }),
  });
}

export async function startExamAttempt(
  uuid: string,
  examId: string | number,
): Promise<ApiResponse<unknown>> {
  return request("/course/exams/attempt", {
    method: "POST",
    body: JSON.stringify({ uuid, exam_id: String(examId) }),
  });
}

export async function enrollCourse(
  course_id: string,
  uuid: string
): Promise<ApiResponse<unknown>> {
  return request("/course/enroll", {
    method: "POST",
    body: JSON.stringify({ course_id, uuid }),
  });
}

export interface WebinarSpeaker {
  id: number;
  name: string;
  title: string | null;
  role: string;
  bio: string | null;
  avatar: string | null;
  contact_email: string | null;
  order: number;
}

export interface WebinarFaq {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface WebinarRsvp {
  id: number;
  user_id: number;
  user_name: string;
  status: string;
  registered_at: string | null;
  joined_at: string | null;
  cancelled_at: string | null;
}

export interface Webinar {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  tags: string | null;
  industry: string | null;
  faqs: WebinarFaq[];
  scheduled_at: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  timezone: string | null;
  platform: string | null;
  meeting_url: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  joining_instructions: string | null;
  is_public: boolean;
  max_attendees: number | null;
  rsvp_count: number;
  allow_guests: boolean;
  status: string;
  vod_status: string | null;
  vod_url: string | null;
  vod_platform: string | null;
  vod_id: string | null;
  vod_published_at: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  is_rsvped: boolean;
  speaker: string | null;
  speaker_title: string | null;
  speakers: WebinarSpeaker[];
  rsvps: WebinarRsvp[];
}

export async function getWebinars(): Promise<ApiResponse<Webinar[]>> {
  return request<Webinar[]>("/webinars");
}

export async function rsvpWebinar(
  id: string | number,
  uuid: string
): Promise<ApiResponse<unknown>> {
  return request(`/webinars/${encodeURIComponent(String(id))}/rsvp`, {
    method: "POST",
    body: JSON.stringify({ uuid }),
  });
}

export interface WebinarRecordingSpeaker {
  id: number;
  name: string;
  title: string | null;
}

export interface WebinarRecording {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  industry: string | null;
  category: string | null;
  thumbnail_url: string | null;
  scheduled_at: string;
  duration_minutes: number;
  platform: string | null;
  vod_url: string | null;
  vod_platform: string | null;
  vod_id: string | null;
  vod_published_at: string | null;
  speakers: WebinarRecordingSpeaker[];
}

export interface WebinarRecordingsResponse {
  success: boolean;
  message?: string;
  data: WebinarRecording[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function getWebinarRecordings(): Promise<WebinarRecordingsResponse> {
  return request<WebinarRecording[]>("/webinars/recordings");
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  published_at: string;
}

export async function getAnnouncements(): Promise<ApiResponse<Announcement[]>> {
  return request<Announcement[]>("/announcements");
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface FaqWebinar {
  webinar_id: number;
  title: string;
  slug: string;
  industry: string | null;
  faqs: Faq[];
}

export interface FaqIndustry {
  industry: string | null;
  faqs_count: number;
  webinars: FaqWebinar[];
}

export interface WebinarFaqsData {
  filters: {
    category: string | null;
    industry: string | null;
    webinar_id: number | null;
  };
  total_faqs: number;
  industries: FaqIndustry[];
}

export async function getWebinarFaqs(): Promise<ApiResponse<WebinarFaqsData>> {
  return request<WebinarFaqsData>("/webinars/faqs");
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
      api_key: "igFS48Ip9YLGHh0NAKojOtBnR7TaWZM5dzqPxCs3rDv1f2Vylm",
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
