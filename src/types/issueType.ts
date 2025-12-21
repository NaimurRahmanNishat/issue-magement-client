// src/types/issueType.ts

import type { CategoryType, Division } from "./authType";

export type IssueStatus =  "pending" | "in-progress" | "solved";

export interface IssueImage {
  public_id: string;
  url: string;
}

export interface Issue {
    _id: string;
    title: string;
    category: CategoryType;
    description: string;
    images: IssueImage[];
    location: string;
    division: Division;
    status: IssueStatus;
    author?: string;
    reviews?: string[];
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


// 1. create issue type
export interface CreateIssueResponse {
    success: boolean;
    message: string;
    issue: Issue;
}

export interface CreateIssuePayload {
    title: string;
    category: CategoryType;
    description: string;
    images: IssueImage[];
    location: string;
    division: Division;
    author?: string;
    date: Date;
}


// 2. get all issues type
export interface GetAllIssuesResponse {
  message: string;
  issues: Issue[];
  totalIssues: number;
  totalPages: number;
}

export interface GetAllIssuesArgs {
    page?: number;
    limit?: number;
    sort?: string;
    status?: IssueStatus;
    division?: Division;
    category?: CategoryType;
    search?: string;
}


// 3. get single issue type
export interface GetSingleIssueResponse {
  success: boolean;
  message: string;
  issue: Issue;
}


// 4. update issue type
export interface UpdateIssueResponse {
  success: boolean;
  message: string;
  issue: Issue;
}



// 5. delete issue type
export interface DeleteIssueResponse {
  success: boolean;
  message: string;
}