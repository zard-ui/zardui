import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  Preview02ActivateAgentDialogComponent,
  Preview02AnalyticsCardComponent,
  Preview02AnomalyAlertComponent,
  Preview02BarChartCardComponent,
  Preview02BookAppointmentComponent,
  Preview02CodespacesCardComponent,
  Preview02ContributionsActivityComponent,
  Preview02ContributorsComponent,
  Preview02EnvironmentVariablesComponent,
  Preview02FeedbackFormComponent,
  Preview02FileUploadComponent,
  Preview02GithubProfileComponent,
  Preview02IconPreviewGridComponent,
  Preview02InviteTeamComponent,
  Preview02InvoiceComponent,
  Preview02LiveWaveformComponent,
  Preview02NoTeamMembersComponent,
  Preview02NotFoundComponent,
  Preview02ObservabilityCardComponent,
  Preview02PieChartCardComponent,
  Preview02ReportBugComponent,
  Preview02ShippingAddressComponent,
  Preview02ShortcutsComponent,
  Preview02SkeletonLoadingComponent,
  Preview02SleepReportComponent,
  Preview02StyleOverviewComponent,
  Preview02TypographySpecimenComponent,
  Preview02UiElementsComponent,
  Preview02UsageCardComponent,
  Preview02VisitorsComponent,
  Preview02WeeklyFitnessSummaryComponent,
} from './preview-02';

/**
 * Canvas "02": a port of shadcn/ui's `blocks/preview` — seven columns of cards (style overview, typography, icons,
 * forms, charts, empty states) so each option of the customizer has something to act on.
 */
@Component({
  selector: 'z-create-canvas-02',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Preview02ActivateAgentDialogComponent,
    Preview02AnalyticsCardComponent,
    Preview02AnomalyAlertComponent,
    Preview02BarChartCardComponent,
    Preview02BookAppointmentComponent,
    Preview02CodespacesCardComponent,
    Preview02ContributionsActivityComponent,
    Preview02ContributorsComponent,
    Preview02EnvironmentVariablesComponent,
    Preview02FeedbackFormComponent,
    Preview02FileUploadComponent,
    Preview02GithubProfileComponent,
    Preview02IconPreviewGridComponent,
    Preview02InviteTeamComponent,
    Preview02InvoiceComponent,
    Preview02LiveWaveformComponent,
    Preview02NoTeamMembersComponent,
    Preview02NotFoundComponent,
    Preview02ObservabilityCardComponent,
    Preview02PieChartCardComponent,
    Preview02ReportBugComponent,
    Preview02ShippingAddressComponent,
    Preview02ShortcutsComponent,
    Preview02SkeletonLoadingComponent,
    Preview02SleepReportComponent,
    Preview02StyleOverviewComponent,
    Preview02TypographySpecimenComponent,
    Preview02UiElementsComponent,
    Preview02UsageCardComponent,
    Preview02VisitorsComponent,
    Preview02WeeklyFitnessSummaryComponent,
  ],
  host: { class: 'block' },
  template: `
    <div
      class="bg-muted 3xl:[--gap:--spacing(12)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)] overflow-x-auto overflow-y-hidden contain-[paint] [--gap:--spacing(4)] md:[--gap:--spacing(10)]"
    >
      <div class="flex w-full min-w-max justify-center">
        <div
          class="bg-muted dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] grid w-[2400px] grid-cols-7 items-start gap-(--gap) p-(--gap) md:w-[3000px] *:[div]:gap-(--gap)"
          data-slot="capture-target"
          data-canvas="preview-02"
        >
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-style-overview />
            <z-preview-02-typography-specimen />
            <div class="md:hidden">
              <z-preview-02-ui-elements />
            </div>
            <z-preview-02-codespaces-card />
            <z-preview-02-invoice />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-icon-preview-grid />
            <div class="hidden w-full md:flex">
              <z-preview-02-ui-elements />
            </div>
            <z-preview-02-observability-card />
            <z-preview-02-shipping-address />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-environment-variables />
            <z-preview-02-bar-chart-card />
            <z-preview-02-invite-team />
            <z-preview-02-activate-agent-dialog />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-skeleton-loading />
            <z-preview-02-pie-chart-card />
            <z-preview-02-no-team-members />
            <z-preview-02-report-bug />
            <z-preview-02-contributors />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-feedback-form />
            <z-preview-02-book-appointment />
            <z-preview-02-sleep-report />
            <z-preview-02-github-profile />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-weekly-fitness-summary />
            <z-preview-02-file-upload />
            <z-preview-02-analytics-card />
            <z-preview-02-usage-card />
            <z-preview-02-shortcuts />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-02-anomaly-alert />
            <z-preview-02-live-waveform />
            <z-preview-02-visitors />
            <z-preview-02-contributions-activity />
            <z-preview-02-not-found />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CanvasTwoComponent {}
