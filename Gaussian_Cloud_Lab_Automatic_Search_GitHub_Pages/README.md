# Gaussian Cloud Lab

A browser-based frequency–angle cloud explorer, decision-rule comparison tool, and constrained category-structure generator. No dependencies, build step, login, paid service, or backend is required.

## Hosting on GitHub Pages

1. Create a GitHub repository, for example `gaussian-cloud-lab`. Use Public if hosting with GitHub Free.
2. Extract this ZIP and upload **all five application files into the same repository folder**:
   - `index.html`
   - `boundaries.js`
   - `generator-core.js`
   - `generator-ui.js`
   - `generator-worker.js`
3. Commit to `main`. You may also upload this README.
4. Go to **Settings → Pages → Deploy from a branch**. Select `main` and `/ (root)`, then Save.
5. The Pages settings will show your website link, normally `https://YOUR-USERNAME.github.io/gaussian-cloud-lab/`.

GitHub documentation: https://docs.github.com/en/pages/quickstart

To run locally, keep the five files together and open `index.html`. In browsers that restrict file-based Web Workers, the app uses a cooperative main-thread search fallback. Hosted search normally runs in a Web Worker.

## Stimulus space and the Gabor preset

**Stimulus-space limits** sets X/frequency and Y/angle minimums and maximums. Apply stimulus space updates the graph limits and mean-slider ranges. Existing point coordinates are retained. The automatic generator rejects an entire candidate if any sampled point is outside the configured limits; it never clips or moves individual points to force compliance.

**Gabor preset: 35 × 180°** sets frequency to `(0,35]` cycles per stimulus and angle to `[0,180)` degrees. The displayed minima are both zero; zero frequency and 180-degree orientation are excluded during Gabor-preset generation. A custom space uses inclusive bounds.

This is a coordinate preset, not a Gabor image renderer or a validation of display resolution, perceptual scaling, or image aliasing.

**Axis limits and grid spacing** separately controls the current viewing window. Physical view restores the configured stimulus space. Fit all points adjusts the viewing window and grid to visible clouds. Viewing limits never alter the data or the allowed generation space.

## Automatic category search

1. Set the stimulus space, or use the Gabor preset.
2. In **Find category structures**, choose II, simple frequency, simple angle, or conjunction.
3. Choose points per category, the number of accepted sets to find, a starting seed, and an attempt limit.
4. Enter minimum and maximum accuracy percentages for vertical, horizontal, conjunction, and best-linear rules. All four constraints apply together. The suggested-range button supplies editable starting values; it does not guarantee feasibility.
5. Optionally set a positive intended-rule advantage and modify the geometry search ranges.
6. Start the search. It stops after the requested number of accepted sets, at the attempt limit, or when cancelled. Already accepted sets remain available after cancellation. Requirements are never silently relaxed.
7. **Load set (replace graph)** rechecks all constraints before displaying the chosen set, assigning its category labels, and plotting its four fitted rules.
8. Download all accepted coordinates as CSV and/or the JSON audit, which includes settings, seeds, cloud definitions, rule coefficients, achieved accuracies, and run rejection counts. Project Save also includes accepted sets and their settings. **Load saved search** imports an exported search audit.

Search results are historical snapshots. Moving clouds or changing shapes on the graph can invalidate constraints. Rule metrics update for the fixed fitted rules; Refit searches again. Loading a saved candidate independently regenerates its sample from stored cloud seeds and recomputes the four rule-family scores.

### Category templates

Every accepted set has exactly the specified total points in A and the same total in B.

- II: two elongated correlated Gaussian clouds, with category displacement across the within-cloud trend. Correlation proposals are biased toward the configured endpoints for some attempts, while remaining within the entered range.
- Simple frequency / simple angle: two Gaussian clouds separated mainly along the chosen dimension, with a small randomized displacement on the other dimension.
- Conjunction: one corner cloud belongs to A, and three other corner clouds belong to B. B's requested point count is divided as evenly as possible across its three clouds. This is a Gaussian mixture in B, not one Gaussian per category. Cutoff directions vary between candidates.

Clouds within a candidate share the same population frequency SD, angle SD, and correlation, but their realized sample covariance matrices need not be identical. SD proposals are sampled on a log scale within the entered ranges. Template midpoints are sampled in the central part of the allowed domain; the padding control moves that central proposal region inward. The separation scale controls template-specific mean offsets in marginal-SD units; it is not an exact Mahalanobis distance. No global optimization over all Gaussian structures is claimed.

The template specifies the proposal geometry. It does not establish a participant's strategy or cognitive learning system. The accuracy and advantage constraints determine which proposals are accepted.

### Accuracy definitions and limits

All reported search accuracies are optimized **finite-sample balanced accuracies**, `(A correct proportion + B correct proportion) / 2`. Since generated A/B sample totals are equal, overall and balanced accuracies coincide for generated sets. Scores are not expected participant accuracies, population Bayes accuracies, or cross-validated estimates.

- Vertical and horizontal: all distinct sample splits and both category mappings are tested.
- Conjunction: all distinct frequency/angle cutoff pairs, four AND-direction combinations, and both category mappings are tested. This is an empirical optimum for an unbounded axis-aligned quadrant versus its complement, not an arbitrary rectangle or XOR rule.
- Best linear / II candidate: all distinct thresholds and both mappings are tested for each selected orientation on the angle grid. Vertical and horizontal orientations are always included. It is a grid optimum, not a guaranteed continuous-orientation global optimum. Search orientations are measured in units standardized by pooled within-cloud sample SDs.

The best-linear family includes simple rules; conjunctions include simple-rule special cases. Their maximum permitted accuracies therefore cannot be below a required simple-rule minimum. The app rejects some directly contradictory constraints and intervals containing no attainable accuracy at the selected point count. Other impossible requests may simply reach the attempt limit without enough matches. Failure to find a set does not prove impossibility.

The intended-rule advantage compares:
- II: linear minus each of vertical, horizontal, and conjunction.
- Conjunction: AND minus each of vertical, horizontal, and linear.
- Simple: the intended simple dimension minus the other simple dimension only, because richer families include simple rules.

Zero advantage permits ties but still requires the intended family to be no worse than those comparison families.

Generated samples are Gaussian proposals that are selected on bounds, scores, and optional advantages. Whole-set rejection and accuracy selection change the accepted sets' sampling properties. Do not describe an accepted finite sample as an unconstrained random Gaussian draw.

Limits are 1,000,000 points per category, 10,000 requested accepted sets, and 10,000,000 attempts. Practical browser memory and computation limits are usually much lower. Conjunction search grows approximately with the product of the numbers of distinct X and Y values. No hidden subsampling is used. The configured attempt limit is a maximum, not a promise of that many evaluations within a particular time.

## Manual clouds and decision rules

Add clouds, choose point counts and seeds, and edit mean frequency/angle. Shape controls expose marginal SDs and correlation. Mean angle moves a cloud vertically; it is not a cloud-rotation control. New manual clouds default to 64 points, SDs 2 and 14, and correlation +0.98. Numeric fields allow values beyond slider ranges subject to positive SDs and correlation strictly between −1 and +1. Manual editing is not constrained by the automatic-search requirements.

In Decision boundaries:
- Draw a line using two clicks or a drag. Escape cancels.
- Fit angle-on-frequency least-squares regression or a standardized principal axis within a selected cloud.
- Assign clouds to A, B, or Ignore. Multiple clouds may belong to either group; the classifier still has two categories.
- Search individual rule families, or add best vertical, horizontal, and conjunction rules together.
- Conjunctions appear as L-shaped rays with the AND region lightly shaded. Equations, category mappings, and current accuracies appear below the plot.
- Hidden clouds still participate in a fit if assigned to A/B. Hidden clouds and points outside the current viewing window remain in exports.
- Lines stay fixed when clouds change; Refit re-estimates them. A within-cloud trend line is descriptive, not evidence of a category separator.

CSV export at the top exports the clouds currently on the graph. The generator CSV button exports all accepted generated sets. Save project retains clouds, axes, stimulus space, rules, and search results. Load project supports earlier project files. Files are not saved automatically when closing or reloading; download a project or audit first.

## Data handling and verification

The application sends no cloud coordinates to a server. Worker messages stay within the browser. All exports download locally. Hosting providers may process ordinary access logs under their own policies.

Checks cover rule geometry, regression, exact conjunction optimization against independent brute-force enumeration, tied coordinates, unequal category sizes, seeded reproducibility, all generator templates, physical bounds without clipping, invalid/contradictory/discrete accuracy requests, attempt exhaustion, cancellation, worker messaging, fresh result revalidation, project/audit roundtripping, and legacy project compatibility. Simulated DOM interaction checks also cover drawing, fitting, automatic search, the Gabor preset, and graph loading.

The default II configuration found three accepted sets in 37 attempts in the development check. Suggested conjunction ranges found two in five attempts. These are software checks, not experimental results or guarantees for other settings. Visual browser verification was unavailable in the development environment.
