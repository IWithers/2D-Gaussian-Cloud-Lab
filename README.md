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

## Hybrid progressive search (default)

Choose **Hybrid progressive (recommended)** under Search method. Independent random search remains available for comparison and compatibility with earlier audits.

The default candidate-evaluation budget is now 500. The initial pool is 50 candidates, up to 5 paths are retained, stalled paths restart after 25 local trials, and fresh random exploration occurs on 20% of post-pool iterations. The search can finish before the pool is complete when the requested number of valid sets has already been found. Initial-pool proposals count toward the budget; final acceptance rechecks are reported separately rather than charged as another candidate. All these settings are editable under Progressive search settings.

Within a path, the means, shared SDs, correlation, separation scale, and applicable template orientation are adjusted while retaining exactly the same underlying standard-normal draws and per-cloud sample seeds. Population covariance remains shared across clouds within a candidate. The algorithm does not independently optimize each cloud's covariance. Parameter changes are bounded by the configured geometry ranges and template midpoint proposal region. SD adjustments use a logarithmic parameter scale and correlation adjustments use a Fisher-z scale. These are numerical search choices, not perceptual transformations of the displayed stimulus coordinates.

Initial adjustment size is 15% of the relevant parameter range, shrinking by a factor of 0.97 after each local trial to a minimum of 1.5%. One parameter changes on most trials, with two selected on some trials. Better candidates are retained; equal-penalty moves are also permitted to traverse accuracy plateaus. Inferior local candidates are discarded. A fresh seed starts a new path or replaces a stalled one. This is a multi-path heuristic, not a gradient-descent method or a global optimizer.

### Screening and hard acceptance

The screen penalty is the square root of summed squared percentage-point accuracy violations, intended-rule advantage violations, normalized physical-bound penalties, and optional geometry-diversity violations. Scores inside their requested ranges contribute zero. Physical penalties account for both the fraction of out-of-range points and the normalized extent of their excursions. Bounds are not repaired by clipping or resampling individual points.

The engine first calculates cheap partial penalties and vertical/horizontal scores. When a conservative partial penalty already exceeds a retained path's penalty, the proposal can be screened out before expensive checks. Otherwise it evaluates a coarser best-linear grid and exact conjunction scores to rank candidates. The effective coarse step is rounded upward to an integer multiple of the final angle step, so the screening orientations are a subset of the final grid, apart from normal floating-point arithmetic.

Coarse linear scores can underestimate the fine-grid score. A coarse minimum failure does not automatically block final validation when the other constraints make the candidate eligible; a coarse success is never acceptance. Every accepted candidate undergoes a fresh coordinate evaluation on the same fixed draws and all four rule-family checks at the configured final linear step, plus all configured accuracy, advantage, physical, seed-distinctness, and optional diversity requirements. No constraint is relaxed. The linear result is still a grid optimum rather than a continuous-angle global optimum.

### Diversity and audit

Each accepted set has a distinct starting/path seed. Optional minimum geometry distance is normalized RMS distance across per-cloud mean coordinates (scaled by domain widths), shared log SDs (scaled by permitted log-SD ranges), and shared correlation on its permitted Fisher-z range. Zero disables geometry-distance filtering; distinct seeds are still used. Geometry-distance filtering also applies to independent random search when requested.

The JSON audit retains the root cloud parameters and seeds, initial path parameters, retained parameter changes with screening penalties, final cloud definitions, final rule coefficients/scores, search options, evaluation counts, restarts, screening counts, and full-check counts. Rejected trial parameter vectors are not individually retained. Progressive starting seeds alone do not encode the final optimized geometry: retain the JSON audit or project file to reproduce a chosen set. The final saved cloud definitions and sample seeds reproduce its coordinates directly.

Search results are optimized finite samples. This method is not guaranteed to be faster than random search for every target, nor to find a feasible solution within the budget. In one deterministic development case with 32 points per category, hybrid search found three valid II sets in 60 candidate evaluations versus 88 for independent random search with the same constraints and starting seed. This is an illustrative software check, not a general performance claim or experimental result.

Additional tests verify deterministic progressive runs, bounded updates for every template, unchanged underlying draws, local improvements reaching acceptance, distinct accepted seeds and optional geometry, restart after stalls, exact evaluation budgets, cancellation, coarse/fine false-positive and false-negative safeguards, final independent score checks, worker execution, UI selection, and project roundtripping of settings and optimization audits. Visual browser verification remains unavailable.

## Option C transfer search from the uploaded R script

This version adds three application files: `transfer-core.js`, `transfer-ui.js`, and `transfer-worker.js`. **Upload all eight application files together** (`index.html`, `boundaries.js`, three `generator-*.js` files, and three `transfer-*.js` files). Keep them in the same directory. The earlier five-file upload directions describe older versions.

Transfer acceptance logic was ported from `II_OPTION_C_V60_H70_CONJ70_15RB(1).R`, SHA-256 `03fe82f8157f1c61030613fbcdb8db0ea0bc8c63490987acfbfc4050f82c7a3c` (6031 lines). The implementation follows the active function bodies rather than outdated nearby comments. R was unavailable in the development environment, so direct execution parity with that script has not been established. The JavaScript PRNG and Gaussian draws differ from R: identical numeric seeds do not yield identical R coordinates.

### Using transfer search

1. Load or create A/B clouds. In Decision boundaries, assign the intended training clouds to Category A/B (or Ignore). Hidden assigned clouds still count.
2. Set the stimulus domain. The R-domain button sets frequency 0–28 and angle 6–174 degrees, as actually derived by the uploaded script's zoom of 1.40. It updates domain/view/slider limits without moving training points. The app's 35 × 180 Gabor preset is a different domain, and hence a different geometric normalization.
3. Open **Search for T1 / T2 transfer stimuli** and its editable constraints. Both T groups always have the same number of points. Default post-zoom base SDs are **1.12 cycles/stimulus and 4.2 degrees**, calculated from 0.8 and 3.0 times 1.40. The older literal 0.96/3.60 values and some comments in the R file are superseded by its later derived settings.
4. Run the search for the current A/B points. Training is snapshotted and remains unchanged. Progress and cancellation are available.
5. Download the full JSON audit and rounded transfer CSV. Accepted T1/T2 points appear as triangles with their diagnostic reference boundaries drawn as dotted lines. These points are an overlay and are not silently added to either training category or the generic training CSV.
6. Save project to retain transfer settings and results. If training coordinates, assignments, or domain change, the transfer overlay is marked stale and transfer CSV export is blocked. Historical JSON audit export remains available and includes its exact training snapshot.

The optional **Require transfer success for each automatically accepted A/B set** checkbox adds a transfer gate to category search. A configurable residual-template pre-screen (default 3 seeds) precedes full final calibration (default 25). Zero screening seeds disables the pre-screen. Joint mode uses the A/B path's starting seed, matching the R script's seed-plus-offset convention; the standalone seed field controls standalone transfer searches. Current A/B rule-accuracy constraints are retained and are not replaced by the R script's separate training-generation criteria. Transfer reference rules are refitted in normalized domain coordinates, and may differ from the app's general best-linear rule. Full transfer failures reject that A/B proposal. This gate can substantially increase runtime; pre-screen failures are search-budget outcomes, not proofs that a larger final seed search could never succeed.

### Active transfer gates and their R counterparts

| Gate or protocol | Implementation |
| --- | --- |
| Physical domain | Positive frequency, orientation [0,180), and configured coordinate-domain limits; checked on actual rounded exported points |
| No duplicate coordinates | Checked within each T group |
| Conflicting intended predictions | Every T1 point: diagonal A / horizontal B; every T2 point: diagonal B / horizontal A |
| Point boundary clearance | Every rounded point clears both diagnostic boundaries by the configured normalized margin |
| Centre prescreen | Exact angle-bisector locations, edge buffer, minimum margin, projected covariance safety Z at the smallest spread |
| Within-group boundary balance | Each group's realized mean distance to horizontal and diagonal boundaries agrees within tolerance |
| Option C | T1-to-A matches T2-to-B and T1-to-B matches T2-to-A in domain-normalized Euclidean coordinates, rechecked after rounding |
| Shape matching | One finite residual pattern is translated to both T groups; pairwise shape differences checked after rounding; no individual reflection |
| Novelty and extremity | Pointwise minimum pooled Mahalanobis distance, group-mean ceiling, pointwise hard ceiling, and maximum T1/T2 group-mean difference |
| Mahalanobis definition | Covariance of all pooled A/B points, including between-category variation, exactly as the R transfer function uses; eigenvalue regularization is recorded |
| Frequency exclusion | Every transfer frequency must be strictly outside the observed combined A/B interval when enabled |
| Internal correlation | Reported for both T groups; optional absolute-correlation rejection, off by default |
| Optional centre-radius constraint | Off by default; centre prescreen and rounded exported centres are checked when enabled |
| Robustness | At least 95% of near-optimal horizontal rules must unanimously make all intended T1/T2 predictions; diagonal robustness is reported, with optional enforcement defaulting to zero |
| Spread calibration | Same residual pattern held fixed across all scales; a contiguous valid run must contain at least the configured retained increments |
| Scale selection | Choose a run reaching the largest valid spread, breaking ties by run length then centre safety; select the configured rank from its widest retained increments |
| Template-seed selection | First successful seed, or nearest to the median maximum-valid scale among successful seeds; configured seeds are all scanned |
| Final verification | Rebuild the chosen rounded points from their saved template seed and selected centre pair, then independently rerun point/group checks and robustness before acceptance |

Seed selection and robustness follow the R ordering: select the default seed/scale first, then apply the robustness gate. If it fails, another seed is not silently substituted. All configured constraints remain hard requirements.

### Reference rules, safety settings, and intentional differences

The diagnostic diagonal is restricted to the editable acute-angle range in normalized coordinates (default 25–65 degrees, both slope families). Finite-set fitting is on by default: pairwise projection-order events, interval midpoints, permitted endpoints, and a seed angle grid are examined. Accuracy is maximized, with projection-gap tie breaking, following the R fallback method. For larger sets, users may explicitly switch to the diagonal angle grid. Exact fitting is limited to 2000 total training points to avoid excessive pairwise memory; no hidden downsampling is used. The chosen fitting method and number of orientations are audited. Near-optimal diagonal alternatives use the selected slope family with a separate 0.5-degree grid; near-optimal horizontal alternatives enumerate all meaningful thresholds and both category mappings. Accuracy floors are the reference accuracy minus 0.025 by default. These transfer diagnostic accuracies are ordinary sample accuracies as in R; with balanced categories they equal balanced accuracy.

The R reference training set is required to have a perfect permitted diagonal. A separate transfer option requires this by default; turning it off explicitly permits transfer diagnostics for imperfect diagonal training. Transfer safety does not automatically impose the R program's V60/H70/conjunction70 training limits; set those separately in the category generator if desired.

An exact finite-sample residual pattern is built by centering, sample-standardizing, and orthogonalizing Gaussian draws. Both groups share its translated rounded residuals, with requested finite-sample SD/correlation before rounding. Means, residuals, and final sums are rounded to the configured digits (default 6 each). Normalized distances use domain widths, independently of the graph viewing window. No point is clipped, moved individually, or conditionally resampled to pass.

The uploaded Option C code no longer enforces intersection reflection or cross-group equality of distances to each boundary. Those values remain diagnostics. The legacy intersection-symmetry flag and legacy whole-sample rejection-attempt settings are not active transfer acceptance criteria in the supplied function bodies, so they are not exposed as operative gates here. The legacy equal-A/B-radius option is off by default; when enabled the web version additionally rechecks it after rounding, making that optional mode slightly stricter than the centre-only R check.

The latest R file has **no extra 0.75-cycle frequency buffer**. The web control defaults to zero to preserve its active condition. Increasing it explicitly adds a stricter buffer outside both ends of the observed A/B frequency interval. Optional diagonal robustness is likewise an explicit additional gate with default zero. Convex-hull exclusion is absent, matching the latest file.

The JSON audit contains the source hash, configuration, training snapshot, reference/near-optimal rules, covariance regularization details, sampled centre diagnostics and retained pairs, successful/failed seed results, spread-grid and optionally all pair-scale rejection reasons, limiting next scale, selected rounded points, shape/balance/Option C checks, robustness details, and pointwise normalized margins, pooled/category-specific Mahalanobis distances, and edge distances. Infinite thresholds in near-optimal alternatives are encoded as strings to survive JSON serialization. The CSV contains the selected rounded coordinates plus pointwise audit fields. Full pair-scale scan retention may produce large audit files; it is an explicit toggle.

The R file also contains reporting-only validity analyses for training and RB/difficulty-series output, including clustering, density, PCA, and broader model diagnostics. Those unrelated reporting suites and R stimulus-generation/RB/difficulty-level algorithms are not ported by this transfer feature. The active transfer acceptance checks above are distinguished from those reporting-only analyses.

### Transfer validation performed

Checks cover exact pre-rounding residual covariance/correlation, regularized covariance inversion, a complete accepted T1/T2 search, post-rounding shape/Option C/boundary/novelty constraints, robust horizontal mapping, independent recreation of the selected set, duplicate/domain/mapping rejection, cancellation, configuration validation, standalone worker messages, stale-source detection, project save/load, joint A/B acceptance, and rejection of otherwise-valid A/B when transfer is infeasible. Independent Python calculations agreed with all selected-point pooled Mahalanobis distances and normalized margins. JavaScript-to-R execution comparison and visual browser verification were unavailable; the scientific equivalence of resulting stimulus sets still requires review and piloting.
