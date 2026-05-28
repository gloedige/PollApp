export type SurveyType = 'active' | 'ending_soon' | 'past';

export interface Survey {
    id: number;
    title: string;
    expiry_date: string | null;
    state?: SurveyType;
    description: string;
    category?: string;
}
