# Input OTP snippets

Illustrative code fragments used as `codeBefore` blocks on the input OTP docs page.
Each fenced block is exported as `INPUT_OTP_SNIPPET_<ID>` via the snippet generator.

```angular-ts {1,3} id="pattern-digits-only" showLineNumbers copyButton
import { REGEXP_ONLY_DIGITS } from '@/shared/components/input-otp/input-otp.utils';

<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
  ...
</z-input-otp>
```
