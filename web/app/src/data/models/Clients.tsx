export interface StudentInfo {
  studentNumber: string;
  college: string;
}

export interface ClientModel {
  id?: string;
  name: string;
  email?: string;
  type: "student" | "non-student";
  studentInfo?: StudentInfo;
}
