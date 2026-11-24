# AdSense investigation — November 24, 2026

## Scope and limits

Reviewed the React routes, legacy HTML sources, calculator formulas, guides, About and Contact pages, legal pages, metadata, robots.txt, sitemap.xml, ads.txt, and Vite production output. The exact rejection notice and AdSense account were not available. The findings below are code evidence, not a diagnosis of Google's rejection or a promise of approval.

The web lookup for the Vercel homepage returned an older cached result pointing to `https://www.rgukt-sgpa-cgpa-calculator.tech/`, with signup/user-placeholder content absent from the current React app. Direct policy/calculator/ads.txt lookups failed, and a terminal HTTPS request could not connect from this environment. This does **not** establish a current redirect or outage. Verify the current public deployment and domain routing before requesting review.

## Findings and implemented fixes

| Evidence | Change |
| --- | --- |
| Vite previously copied the homepage's static root into calculator, department and Contact outputs; only article pages had their own fallback. | Built legacy calculators now include their own subject/credit tables. Department and generic calculator pages include working calculator links. Contact has a private email and public issue link. Trust links are included in every built HTML page, before JavaScript runs. Query-selected calculators still render their selected subjects through React; their shared static shell provides a calculator directory. |
| `calculateSGPA` treated REM as zero deduction from maximum points, identical to EX. The repository provides no verified REM mapping. | Block calculations containing REM with an explanation; clear a stale result after a failed submission. Supported grade calculations are unchanged. A maintainer must verify the meaning of REM against applicable regulations before enabling it. |
| About claimed calculations were based on the official grading system without citing a campus/batch regulation, and claimed no data was stored despite stored analytics preferences. | Replaced these claims with accurate descriptions of editable defaults, local grade processing, optional analytics, and preference storage. |
| The React Contact route offered public issues and a clipboard draft but no direct private contact, although the privacy page listed an email. | Added the same maintainer email and a warning against publishing personal details in public issues. The draft form continues to clearly state it does not send email. |
| Legacy source HTML still contains old advertising/analytics scripts, while Vite intentionally replaces those shells and strips article scripts. Hosting raw source would bypass the current privacy behavior. | Added explicit Vercel Vite/build/output settings. Deploy `dist/`; do not publish the repository root as a static folder. Added production-output checks for every HTML page. |

## Existing implementation that was already correct in the production build

- The common head retains `google-adsense-account` for `ca-pub-7812693991042173`. `ads.txt` has the matching `pub-7812693991042173` DIRECT record and Google's seller identifier. These identifiers are internally consistent; account ownership is unverified.
- No ad-serving script or ad slot is emitted in the current production build. Ads are deliberately paused; removing this pause is not an approval fix.
- Analytics loads only after an optional choice. The privacy notice describes local calculator processing, hosting, analytics, preferences, paused advertising, and contact options. Its analytics controls are not an advertising CMP.
- Footer links expose Disclaimer, Privacy and Terms; About is in the header and Contact is in the footer. Guides include calculation explanations and worked examples. Robots allows crawling and identifies the sitemap. None of these facts establishes that Google considers the content sufficient.

## Before requesting another review

1. In **AdSense → Sites**, open the exact site and record the full “Needs attention” reason. Check Policy center separately for any listed violations. Fix the stated issue rather than assuming every rejection means low-value content.
2. Verify the submitted hostname, current redirects, Vercel production deployment/branch and domain settings. If the custom domain is the real primary destination, reconcile AdSense site registration, canonical URLs, social metadata, robots and sitemap with that decision. This patch keeps the user's specified Vercel hostname; an old cached search result is insufficient reason to change it.
3. Deploy this build, then independently check HTTP status, HTTPS redirects, calculator operation, trust links, `/ads.txt`, `/robots.txt`, `/sitemap.xml`, and crawler access without login or Vercel deployment protection. Check AdSense crawler errors and Search Console URL inspection where available.
4. Confirm the publisher ID against the account's supplied verification method and ads.txt record. Check the account's verification and ads.txt statuses after deployment. A missing serving script alone does not prove failed ownership verification: Google also supports verification alternatives. Complete any account setup tasks shown, including payment details if requested.
5. Review **Privacy & messaging** and the applicable Google-certified CMP requirements for EEA, UK and Switzerland traffic before enabling advertising. The analytics choice is not a substitute. Check Auto ads and exclusions so ads do not obscure calculator controls, appear on error/empty screens, or dominate navigation and policy pages. Do not enable ads solely to try to force approval.
6. Verify subject/credit defaults and guide claims against the relevant campus, batch and academic regulations. REM is now blocked; CGPA still uses an explicitly disclosed equal-semester average. Credit-weighted CGPA, grade cutoffs and classification thresholds require authoritative academic evidence before changing the rules. If Google's notice specifically cites content value, improve original, verified student guidance rather than adding duplicate semester pages or filler. There is no guaranteed approval threshold based on a page count.
7. Once the deployed fixes and the account-specific tasks are complete, request review from the site's AdSense entry. This repository change has not deployed the site or submitted a review.

## Validation

Run `npm test`, `npm run build`, then `node scripts/verify-build.js`. The last check inspects every emitted HTML page for publisher verification, paused ad/tracking scripts, static trust links and local HTML link targets, and checks representative route content plus ads.txt.

## Google references

- [Site not ready: content, access, verification and review](https://support.google.com/adsense/answer/12176698?hl=en)
- [Site approval and ads.txt statuses; incomplete account setup](https://support.google.com/adsense/answer/12170222)
- [Site connection and verification alternatives](https://support.google.com/adsense/answer/12169212?hl=en)
- [Publisher privacy disclosures](https://support.google.com/publisherpolicies/answer/10437794?hl=en)
