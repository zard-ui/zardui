import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-scrollable',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-75" zPlaceholder="Select a timezone" zPosition="popper" [(zValue)]="selectedTimezone">
      <z-select-group>
        <z-select-label>North America</z-select-label>
        <z-select-item zValue="est">Eastern Standard Time (EST)</z-select-item>
        <z-select-item zValue="cst">Central Standard Time (CST)</z-select-item>
        <z-select-item zValue="mst">Mountain Standard Time (MST)</z-select-item>
        <z-select-item zValue="pst">Pacific Standard Time (PST)</z-select-item>
        <z-select-item zValue="akst">Alaska Standard Time (AKST)</z-select-item>
        <z-select-item zValue="hst">Hawaii Standard Time (HST)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Europe & Africa</z-select-label>
        <z-select-item zValue="gmt">Greenwich Mean Time (GMT)</z-select-item>
        <z-select-item zValue="cet">Central European Time (CET)</z-select-item>
        <z-select-item zValue="eet">Eastern European Time (EET)</z-select-item>
        <z-select-item zValue="west">Western European Summer Time (WEST)</z-select-item>
        <z-select-item zValue="cat">Central Africa Time (CAT)</z-select-item>
        <z-select-item zValue="eat">East Africa Time (EAT)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Asia</z-select-label>
        <z-select-item zValue="msk">Moscow Time (MSK)</z-select-item>
        <z-select-item zValue="ist">India Standard Time (IST)</z-select-item>
        <z-select-item zValue="cst_china">China Standard Time (CST)</z-select-item>
        <z-select-item zValue="jst">Japan Standard Time (JST)</z-select-item>
        <z-select-item zValue="kst">Korea Standard Time (KST)</z-select-item>
        <z-select-item zValue="ist_indonesia">Indonesia Central Standard Time (WITA)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Australia & Pacific</z-select-label>
        <z-select-item zValue="awst">Australian Western Standard Time (AWST)</z-select-item>
        <z-select-item zValue="acst">Australian Central Standard Time (ACST)</z-select-item>
        <z-select-item zValue="aest">Australian Eastern Standard Time (AEST)</z-select-item>
        <z-select-item zValue="nzst">New Zealand Standard Time (NZST)</z-select-item>
        <z-select-item zValue="fjt">Fiji Time (FJT)</z-select-item>
      </z-select-group>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectScrollableComponent {
  readonly selectedTimezone = signal('');
}
