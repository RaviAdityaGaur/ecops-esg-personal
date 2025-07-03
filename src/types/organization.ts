export type Step = {
  id: number
  title: string
  status: "complete" | "in-progress" | "pending"
}

export type OrganizationFormData = {
  organizationDetails: string
  entitiesName: string
  organizationSize: string
  geographicLocation: string
}

