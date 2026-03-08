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
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Destination {
  _id: string;
  name: string;
  details?: string;
  image?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Package {
  _id: string;
  name: string;
  title?: string;
  duration?: string;
  durationDescription?: string;
  description?: string;
  image?: string;
  images?: string[];
  categories?: Category[];
  destinations?: Destination[];
  itineraryTemplate?: string;
  inclusionExclusionSet?: string;
  paymentRefundPolicyTemplate?: string;
  termsConditionTemplate?: string;
  // Extended when fetching single package (GET /packages/:id)
  itinerary?: ItineraryItem[];
  paymentRefundPolicy?: { content?: string };
  inclusions?: InclusionExclusionItem[];
  exclusions?: InclusionExclusionItem[];
  termsCondition?: { content?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageCreateRequest {
  name: string;
  title?: string;
  duration?: string;
  durationDescription?: string;
  description?: string;
  image?: string;
  images?: string[];
  itineraryTemplateId?: string;
  inclusionExclusionSetId?: string;
  paymentRefundPolicyTemplateId?: string;
  termsConditionTemplateId?: string;
}

export interface PackageUpdateRequest extends Partial<PackageCreateRequest> {}

export interface PackageAssignRequest {
  categoryIds?: string[];
  destinationIds?: string[];
}

// Itineraries
export interface ItineraryItem {
  _id: string;
  dayNumber: number;
  title: string;
  description: string;
}

// Policies & Terms
export interface PolicyResponse {
  content: string;
}

// Inclusions & Exclusions
export interface InclusionExclusionItem {
  _id: string;
  type: "inclusion" | "exclusion";
  text: string;
  order: number;
}

// Reusable templates (admin creates once, then selects when creating package)
export interface ItineraryTemplate {
  _id: string;
  name: string;
  days: { dayNumber: number; title: string; description?: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InclusionExclusionSet {
  _id: string;
  name: string;
  items: InclusionExclusionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRefundPolicyTemplate {
  _id: string;
  name: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TermsConditionTemplate {
  _id: string;
  name: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
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
    "ItineraryTemplate",
    "InclusionExclusionSet",
    "PaymentRefundPolicyTemplate",
    "TermsConditionTemplate",
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
        params: params || undefined,
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
        params: params || undefined,
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

    // Itinerary templates (reusable; admin creates, then selects when creating package)
    getItineraryTemplates: builder.query<ApiEnvelope<ItineraryTemplate[]>, void>({
      query: () => "/api/itinerary-templates",
      providesTags: ["ItineraryTemplate"],
    }),
    getItineraryTemplate: builder.query<ApiEnvelope<ItineraryTemplate>, string>({
      query: (id) => `/api/itinerary-templates/${id}`,
      providesTags: ["ItineraryTemplate"],
    }),
    createItineraryTemplate: builder.mutation<
      ApiEnvelope<ItineraryTemplate>,
      Partial<ItineraryTemplate>
    >({
      query: (body) => ({
        url: "/api/itinerary-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ItineraryTemplate", "Package"],
    }),
    updateItineraryTemplate: builder.mutation<
      ApiEnvelope<ItineraryTemplate>,
      { id: string; body: Partial<ItineraryTemplate> }
    >({
      query: ({ id, body }) => ({
        url: `/api/itinerary-templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ItineraryTemplate", "Package"],
    }),
    deleteItineraryTemplate: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/itinerary-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ItineraryTemplate", "Package"],
    }),

    // Inclusion/Exclusion sets
    getInclusionExclusionSets: builder.query<ApiEnvelope<InclusionExclusionSet[]>, void>({
      query: () => "/api/inclusion-exclusion-sets",
      providesTags: ["InclusionExclusionSet"],
    }),
    getInclusionExclusionSet: builder.query<ApiEnvelope<InclusionExclusionSet>, string>({
      query: (id) => `/api/inclusion-exclusion-sets/${id}`,
      providesTags: ["InclusionExclusionSet"],
    }),
    createInclusionExclusionSet: builder.mutation<
      ApiEnvelope<InclusionExclusionSet>,
      Partial<InclusionExclusionSet>
    >({
      query: (body) => ({
        url: "/api/inclusion-exclusion-sets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InclusionExclusionSet", "Package"],
    }),
    updateInclusionExclusionSet: builder.mutation<
      ApiEnvelope<InclusionExclusionSet>,
      { id: string; body: Partial<InclusionExclusionSet> }
    >({
      query: ({ id, body }) => ({
        url: `/api/inclusion-exclusion-sets/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["InclusionExclusionSet", "Package"],
    }),
    deleteInclusionExclusionSet: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/inclusion-exclusion-sets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["InclusionExclusionSet", "Package"],
    }),

    // Payment/Refund policy templates
    getPaymentRefundPolicyTemplates: builder.query<
      ApiEnvelope<PaymentRefundPolicyTemplate[]>,
      void
    >({
      query: () => "/api/payment-policies",
      providesTags: ["PaymentRefundPolicyTemplate"],
    }),
    createPaymentRefundPolicyTemplate: builder.mutation<
      ApiEnvelope<PaymentRefundPolicyTemplate>,
      Partial<PaymentRefundPolicyTemplate>
    >({
      query: (body) => ({
        url: "/api/payment-policies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentRefundPolicyTemplate", "Package"],
    }),
    updatePaymentRefundPolicyTemplate: builder.mutation<
      ApiEnvelope<PaymentRefundPolicyTemplate>,
      { id: string; body: Partial<PaymentRefundPolicyTemplate> }
    >({
      query: ({ id, body }) => ({
        url: `/api/payment-policies/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentRefundPolicyTemplate", "Package"],
    }),
    deletePaymentRefundPolicyTemplate: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/payment-policies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentRefundPolicyTemplate", "Package"],
    }),

    // Terms & Conditions templates
    getTermsConditionTemplates: builder.query<
      ApiEnvelope<TermsConditionTemplate[]>,
      void
    >({
      query: () => "/api/terms-conditions",
      providesTags: ["TermsConditionTemplate"],
    }),
    createTermsConditionTemplate: builder.mutation<
      ApiEnvelope<TermsConditionTemplate>,
      Partial<TermsConditionTemplate>
    >({
      query: (body) => ({
        url: "/api/terms-conditions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermsConditionTemplate", "Package"],
    }),
    updateTermsConditionTemplate: builder.mutation<
      ApiEnvelope<TermsConditionTemplate>,
      { id: string; body: Partial<TermsConditionTemplate> }
    >({
      query: ({ id, body }) => ({
        url: `/api/terms-conditions/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["TermsConditionTemplate", "Package"],
    }),
    deleteTermsConditionTemplate: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/terms-conditions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TermsConditionTemplate", "Package"],
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

  useGetItineraryTemplatesQuery,
  useGetItineraryTemplateQuery,
  useCreateItineraryTemplateMutation,
  useUpdateItineraryTemplateMutation,
  useDeleteItineraryTemplateMutation,
  useGetInclusionExclusionSetsQuery,
  useGetInclusionExclusionSetQuery,
  useCreateInclusionExclusionSetMutation,
  useUpdateInclusionExclusionSetMutation,
  useDeleteInclusionExclusionSetMutation,
  useGetPaymentRefundPolicyTemplatesQuery,
  useCreatePaymentRefundPolicyTemplateMutation,
  useUpdatePaymentRefundPolicyTemplateMutation,
  useDeletePaymentRefundPolicyTemplateMutation,
  useGetTermsConditionTemplatesQuery,
  useCreateTermsConditionTemplateMutation,
  useUpdateTermsConditionTemplateMutation,
  useDeleteTermsConditionTemplateMutation,
} = tgheApi;

