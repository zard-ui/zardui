# Input OTP snippets

Illustrative code fragments used as `codeBefore` blocks on the input OTP docs page.
Each fenced block is exported as `INPUT_OTP_SNIPPET_<ID>` via the snippet generator.

```angular-ts id="pattern-alphanumeric" copyButton
import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@/shared/components/input-otp/input-otp.utils';

<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
  ...
</z-input-otp>
```
