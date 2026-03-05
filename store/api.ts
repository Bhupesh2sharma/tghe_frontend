import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// Shared types
export interface ApiEnvelope<T> {
  data: T;
}

// Admin
export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
}

// Analytics
export interface AnalyticsData {
  categories: number;
  destinations: number;
  packages: number;
  enquiries: number;
  contacts: number;
  newsletter: number;
}

// Notifications
export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}

// Newsletter
export interface NewsletterSubscribeRequest {
  email: string;
}

export interface NewsletterItem {
  email: string;
  createdAt: string;
}

// Enquiries
export interface EnquiryRequest {
  name: string;
  email: string;
  pax?: number;
  phone?: string;
  packageId?: string;
  packageName?: string;
  tourDate?: string;
  message?: string;
}

export interface EnquiryItem extends EnquiryRequest {
  _id: string;
  createdAt: string;
}

// Contacts
export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message?: string;
  noOfAdults?: number;
  noOfChildren?: number;
}

export interface ContactItem extends ContactRequest {
  _id: string;
  createdAt: string;
}

// Categories / Destinations / Packages
export interface Category {
  _id: string;
  name: string;
  title?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Destination {
  _id: string;
  name: string;
  details?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Package {
  _id: string;
  name: string;
  title?: string;
  duration?: string;
  description?: string;
  image?: string;
  termsConditions?: string;
  paymentPolicy?: string;
  categories?: Category[];
  destinations?: Destination[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageCreateRequest {
  name: string;
  title?: string;
  duration?: string;
  description?: string;
  image?: string;
  termsConditions?: string;
  paymentPolicy?: string;
}

export interface PackageUpdateRequest extends Partial<PackageCreateRequest> {}

export interface PackageAssignRequest {
  categoryIds?: string[];
  destinationIds?: string[];
}

// Upload
export interface UploadImageResponse {
  url: string;
  publicId: string;
}

export const tgheApi = createApi({
  reducerPath: "tgheApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Analytics",
    "Notification",
    "Newsletter",
    "Enquiry",
    "Contact",
    "Category",
    "Destination",
    "Package",
  ],
  endpoints: (builder) => ({
    // Health & Test
    health: builder.query<{ status: string }, void>({
      query: () => "/health",
    }),
    test: builder.query<unknown, void>({
      query: () => "/api/test",
    }),

    // Admin
    adminRegister: builder.mutation<ApiEnvelope<unknown>, AdminCredentials>({
      query: (body) => ({
        url: "/api/admin/register",
        method: "POST",
        body,
      }),
    }),
    adminLogin: builder.mutation<ApiEnvelope<AdminAuthResponse>, AdminCredentials>(
      {
        query: (body) => ({
          url: "/api/admin/login",
          method: "POST",
          body,
        }),
      }
    ),

    // Analytics
    getAnalytics: builder.query<ApiEnvelope<AnalyticsData>, void>({
      query: () => "/api/analytics",
      providesTags: ["Analytics"],
    }),

    // Notifications
    getNotifications: builder.query<
      ApiEnvelope<NotificationItem[]>,
      { read?: boolean; limit?: number } | void
    >({
      query: (params) => ({
        url: "/api/notifications",
        params,
      }),
      providesTags: ["Notification"],
    }),
    getUnreadNotificationsCount: builder.query<ApiEnvelope<UnreadCount>, void>({
      query: () => "/api/notifications/unread-count",
      providesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation<ApiEnvelope<{ modifiedCount: number }>, void>(
      {
        query: () => ({
          url: "/api/notifications/read-all",
          method: "PATCH",
        }),
        invalidatesTags: ["Notification"],
      }
    ),
    markNotificationRead: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Upload
    uploadImage: builder.mutation<ApiEnvelope<UploadImageResponse>, FormData>({
      query: (formData) => ({
        url: "/api/upload/image",
        method: "POST",
        body: formData,
      }),
    }),

    // Newsletter
    subscribeNewsletter: builder.mutation<
      ApiEnvelope<{ email: string }>,
      NewsletterSubscribeRequest
    >({
      query: (body) => ({
        url: "/api/newsletter",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Newsletter"],
    }),
    getNewsletters: builder.query<ApiEnvelope<NewsletterItem[]>, void>({
      query: () => "/api/newsletter",
      providesTags: ["Newsletter"],
    }),

    // Enquiries
    createEnquiry: builder.mutation<ApiEnvelope<EnquiryItem>, EnquiryRequest>({
      query: (body) => ({
        url: "/api/enquiries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enquiry"],
    }),
    getEnquiries: builder.query<ApiEnvelope<EnquiryItem[]>, void>({
      query: () => "/api/enquiries",
      providesTags: ["Enquiry"],
    }),

    // Contacts
    createContact: builder.mutation<ApiEnvelope<ContactItem>, ContactRequest>({
      query: (body) => ({
        url: "/api/contacts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
    getContacts: builder.query<ApiEnvelope<ContactItem[]>, void>({
      query: () => "/api/contacts",
      providesTags: ["Contact"],
    }),

    // Categories
    getCategories: builder.query<ApiEnvelope<Category[]>, void>({
      query: () => "/api/categories",
      providesTags: ["Category"],
    }),
    getCategory: builder.query<ApiEnvelope<Category>, string>({
      query: (id) => `/api/categories/${id}`,
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<ApiEnvelope<Category>, Partial<Category>>({
      query: (body) => ({
        url: "/api/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category", "Package"],
    }),
    createCategoryForm: builder.mutation<ApiEnvelope<Category>, FormData>({
      query: (formData) => ({
        url: "/api/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category", "Package"],
    }),
    updateCategory: builder.mutation<
      ApiEnvelope<Category>,
      { id: string; body: Partial<Category> }
    >({
      query: ({ id, body }) => ({
        url: `/api/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Category", "Package"],
    }),
    updateCategoryForm: builder.mutation<
      ApiEnvelope<Category>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/api/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Category", "Package"],
    }),
    deleteCategory: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Package"],
    }),

    // Destinations
    getDestinations: builder.query<ApiEnvelope<Destination[]>, void>({
      query: () => "/api/destinations",
      providesTags: ["Destination"],
    }),
    getDestination: builder.query<ApiEnvelope<Destination>, string>({
      query: (id) => `/api/destinations/${id}`,
      providesTags: ["Destination"],
    }),
    createDestination: builder.mutation<
      ApiEnvelope<Destination>,
      Partial<Destination>
    >({
      query: (body) => ({
        url: "/api/destinations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Destination", "Package"],
    }),
    createDestinationForm: builder.mutation<
      ApiEnvelope<Destination>,
      FormData
    >({
      query: (formData) => ({
        url: "/api/destinations",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Destination", "Package"],
    }),
    updateDestination: builder.mutation<
      ApiEnvelope<Destination>,
      { id: string; body: Partial<Destination> }
    >({
      query: ({ id, body }) => ({
        url: `/api/destinations/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Destination", "Package"],
    }),
    updateDestinationForm: builder.mutation<
      ApiEnvelope<Destination>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/api/destinations/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Destination", "Package"],
    }),
    deleteDestination: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/destinations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Destination", "Package"],
    }),

    // Packages
    getPackages: builder.query<
      ApiEnvelope<Package[]>,
      { categoryId?: string; destinationId?: string } | void
    >({
      query: (params) => ({
        url: "/api/packages",
        params,
      }),
      providesTags: ["Package"],
    }),
    getPackage: builder.query<ApiEnvelope<Package>, string>({
      query: (id) => `/api/packages/${id}`,
      providesTags: ["Package"],
    }),
    createPackage: builder.mutation<
      ApiEnvelope<Package>,
      PackageCreateRequest
    >({
      query: (body) => ({
        url: "/api/packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Package"],
    }),
    createPackageForm: builder.mutation<ApiEnvelope<Package>, FormData>({
      query: (formData) => ({
        url: "/api/packages",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Package"],
    }),
    updatePackage: builder.mutation<
      ApiEnvelope<Package>,
      { id: string; body: PackageUpdateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/packages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Package"],
    }),
    updatePackageForm: builder.mutation<
      ApiEnvelope<Package>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/api/packages/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Package"],
    }),
    assignPackageCategoriesDestinations: builder.mutation<
      ApiEnvelope<Package>,
      { id: string; body: PackageAssignRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/packages/${id}/categories-destinations`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Package", "Category", "Destination"],
    }),
    deletePackage: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useHealthQuery,
  useTestQuery,
  useAdminRegisterMutation,
  useAdminLoginMutation,
  useGetAnalyticsQuery,
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useUploadImageMutation,
  useSubscribeNewsletterMutation,
  useGetNewslettersQuery,
  useCreateEnquiryMutation,
  useGetEnquiriesQuery,
  useCreateContactMutation,
  useGetContactsQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useCreateCategoryFormMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryFormMutation,
  useDeleteCategoryMutation,
  useGetDestinationsQuery,
  useGetDestinationQuery,
  useCreateDestinationMutation,
  useCreateDestinationFormMutation,
  useUpdateDestinationMutation,
  useUpdateDestinationFormMutation,
  useDeleteDestinationMutation,
  useGetPackagesQuery,
  useGetPackageQuery,
  useCreatePackageMutation,
  useCreatePackageFormMutation,
  useUpdatePackageMutation,
  useUpdatePackageFormMutation,
  useAssignPackageCategoriesDestinationsMutation,
  useDeletePackageMutation,
} = tgheApi;

