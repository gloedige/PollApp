import { Routes } from '@angular/router';
import { SurveyDashboard } from './features/survey-dashboard/survey-dashboard';
import { SurveyDetail } from './features/survey-detail/survey-detail';

export const routes: Routes = [
    {path: "", redirectTo: "dashboard", pathMatch: "full"},
    {path: "dashboard", component: SurveyDashboard},
    {path: "detail", component: SurveyDetail}
];
