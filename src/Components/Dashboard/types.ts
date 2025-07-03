export interface Survey {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  organisation: number;
  site: number;
  created_by: number;
  survey_type?: string;
  disclosure_type?: string;
}

export interface StakeholderSummary {
  internal?: {
    [dimension: string]: {
      percentage: number;
    };
  };
  external?: {
    [dimension: string]: {
      count: number;
      percentage: number;
    };
  };
}

export interface SurveyAggregate {
  survey: {
    id: number;
    name: string;
  };
  dimension_summary: {
    [dimension: string]: {
      [disclosure: string]: {
        internal?: {
          avg_severity: number;
          avg_likelihood: number;
        };
        external?: {
          avg_severity: number;
          avg_likelihood: number;
        };
        combined: {
          avg_severity: string | number;
          avg_likelihood: string | number;
        };
      };
    };
  };
  stakesholder_summary: StakeholderSummary;
  total_respondents: {
    internal: number;
    external: number;
  };
}

export interface StakeholderRelationship {
  survey: {
    id: number;
    name: string;
  };
  stakeholder_relationship_totals: {
    stake_holder_breakup: Array<{
      created_by: number;
      total: number;
      relationship_with_company: string;
    }>;
    [key: string]: any;
  };
}

export interface MaterialityResponse {
  id: number;
  survey_disclosure: number;
  survey_id: number;
  severity: number;
  likelihood: number;
  optional_reason: string;
  stakeholder_type: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface DisclosureResponse {
  disclosure_id: string;
  survey_disclosure_mapping_id: number;
  disclosure_description: string;
  dimension: string;
}

export interface MaterialityData {
  severity: number;
  likelihood: number;
  stakeholder_type: string;
  survey_disclosure: number;
}

export interface MaterialityStats {
  survey: {
    id: number;
    name: string;
  };
  total_disclosures: number;
  stakeholder_totals: Array<{
    stakeholder_type: string;
    total: number;
  }>;
  dimension_totals: Array<{
    survey_disclosure__disclosure__dimension: string;
    total: number;
  }>;
  stakeholder_dimension_totals: Array<{
    stakeholder_type: string;
    survey_disclosure__disclosure__dimension: string;
    total: number;
  }>;
}

export interface ImpactMaterialityData {
  survey: {
    id: number;
    name: string;
    survey_type: string;
  };
  materiality_summary: {
    [dimension: string]: {
      [disclosure_id: string]: {
        internal?: {
          impact_severity: number;
          impact_likelihood: number;
          impact_materiality: number;
          financial_materiality: number;
          final_impact_materiality: number;
          final_financial_materiality: number;
          disclosure_rating: number;
          disclosure_rating_percent: number;
          count: number;
        };
        external?: {
          impact_severity: number;
          impact_likelihood: number;
          impact_materiality: number;
          financial_materiality: number;
          final_impact_materiality: number;
          final_financial_materiality: number;
          disclosure_rating: number;
          disclosure_rating_percent: number;
          count: number;
        };
        overall_double_materiality: number;
      };
    };
  };
  total_respondents: {
    internal: number;
    external: number;
  };
}

export interface SurveyDisclosure {
  id: number;
  disclosure_id: string;
  disclosure_description: string;
  disclosure_type: string;
  dimension: string;
}

export interface TableRow {
  id: string;
  name: string;
  dimension: string;
  internalStatus: string;
  externalStatus: string;
  averageStatus: string;
  internalDetails: any;
  externalDetails: any;
  combinedDetails: any;
}
