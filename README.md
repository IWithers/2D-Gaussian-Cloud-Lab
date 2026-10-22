# Gaussian Cloud Lab

An interactive frequency–angle Gaussian cloud explorer. Runs entirely in your browser, with no dependencies, build step, account login, or backend.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `gaussian-cloud-lab`. Choose Public if using GitHub Free.
2. Extract this ZIP on your computer.
3. In the repository, choose **Add file → Upload files**. Upload `index.html` and this `README.md` directly to the repository root (not inside another folder). Commit the files to `main`.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)` folder, then **Save**.
7. Wait for deployment. Your Pages settings will show the website link, normally `https://YOUR-USERNAME.github.io/gaussian-cloud-lab/`.

GitHub documentation: https://docs.github.com/en/pages/quickstart
Publishing can take up to 10 minutes. The website is publicly accessible when hosted on normal public GitHub Pages.

## Run on your computer

Double-click `index.html` to open it in a modern browser. No installation or internet connection is needed for the app itself.

## Controls

- Add any number of distributions and choose each point count. Available memory and processing speed set practical limits; very large counts can freeze the browser.
- Frequency and angle sliders move each cloud while preserving its sampled points.
- Shape controls set population standard deviations and correlation. Finite-sample statistics can differ from these parameters.
- Point count or seed changes generate a sample. Resample increments the seed.
- Fit all points includes every visible cloud; Physical view restores frequency 0–30 and angle 0–180 degrees.
- Hidden clouds are still included in CSV exports and saved projects.
- Export CSV downloads stimulus coordinates with distribution IDs, names, point IDs, and seeds.
- Save project downloads a JSON file. Load project restores distributions from that file. Projects are not automatically saved; download them before closing or reloading the page.

## Scientific interpretation

Samples are untruncated bivariate Gaussians. Points with frequency <= 0 or angle outside [0, 180) are retained and flagged, rather than removed or clipped from the data. Some points may be outside the current plot view; use Fit all points to inspect them.

Axes have different physical units. Visual slopes and Euclidean distances depend on axis ranges. This explorer does not apply II/RB classification accuracy, perceptual scaling, transfer placement, or stimulus acceptance constraints, and it does not generate Gabor images.

## Data handling

The application code makes no network requests and does not send cloud coordinates to a server. CSV and project files are downloaded locally. GitHub may process hosting access logs under its own policies.

## Verification

JavaScript syntax, reproducible seeded sampling, exact slider translation, and approximate sample correlation were checked. Automated visual browser testing was unavailable in the development environment.

## Custom axes and grid
Open Axis limits and grid spacing. Set X and Y minimums, maximums, and separate positive grid intervals, then click Apply axes and grid. Grid lines and labels are at multiples of the chosen intervals. Projects save these settings. Fit all points automatically chooses limits and spacing; Physical view restores the defaults. Slider ranges are configured separately.

## Decision boundaries

Upload **both `index.html` and `boundaries.js`** into the same repository folder. Keep the JavaScript file next to the HTML file when running locally too.

The Decision boundaries panel is below the graph:

- **Draw a line:** click two plot positions, or drag between them. The infinite straight line is clipped to the current plot view. Escape or Cancel drawing exits drawing mode.
- **Fit within cloud:** select a cloud and choose least-squares regression of angle on frequency, or a principal axis in units standardized by that cloud's sample SDs. The principal axis treats the two standardized dimensions symmetrically. Regression reports the sample correlation and R-squared; zero-spread and undefined fits are rejected.
- **Find best separator:** assign clouds to Category A, Category B, or Ignore. More than one cloud may belong to a category. The classifier still has two categories, rather than three or more separate class labels.
- Choose all orientations, vertical only (frequency), or horizontal only (angle). A 0.5-degree step is the default for the all-orientations search; smaller steps search more lines and take longer.
- The search uses every selected point, even if its cloud is hidden or it lies outside the plotted limits. It tests both label directions and all distinct projection thresholds at each orientation; tied projections cannot be split.
- The objective is balanced sample accuracy: `(A correct proportion + B correct proportion) / 2`. This weights the two category groups equally. Within each category, each point has equal weight, so clouds with more points have more influence.
- Angles in the search refer to line-normal orientations in coordinates standardized by pooled within-cloud sample SDs. The plotted angle is affected by the two physical units and axis limits. Vertical and horizontal rules are included explicitly.
- This is the best observed accuracy on the searched angle grid, **not** a guaranteed global optimum over continuous orientations, a Bayes-optimal classifier, a cross-validated estimate, or a prediction of participant performance. Covariance differences can make a nonlinear classifier better than any straight line.
- Lines show equations in the original frequency and angle units. A separator's low side means `a*frequency + b*angle <= c`; the opposite side is high. Category mapping and current category-specific, balanced, and overall accuracies appear below the line.
- Lines remain fixed when stimuli change. The tool reports when a fit is stale. Use **Refit** to recalculate with the original cloud/category selection; create a new separator to use new category assignments.
- A within-cloud trend line is descriptive and is not automatically a category separator.
- Project JSON files save boundaries and their settings, in addition to clouds and axes. Older project JSON files without boundaries remain supported. CSV stimulus export continues to contain stimulus coordinates; it does not include boundary coefficients. Use Save project to retain those coefficients.

### Additional verification

Numerical checks cover regression coefficients, vertical boundaries, line clipping, tied points, unequal category sizes, reversed labels, diagonal separation, search cancellation, and multiple clouds per category. A simulated DOM smoke test covers initialization, drawing, fitting, search controls, project roundtripping, remapping saved cloud references, and loading legacy projects. Visual browser testing remained unavailable.

## Vertical, horizontal, and conjunction comparison

Assign two or more clouds to the two category groups, then click **Add best vertical + horizontal + conjunction**. This adds three coloured rules together and reports their balanced sample accuracies. You can also select each family individually in the Search family dropdown.

- Vertical: one frequency cutoff, tested at all distinct sample splits, with both category mappings.
- Horizontal: one angle cutoff, tested at all distinct sample splits, with both category mappings.
- Conjunction: one frequency cutoff AND one angle cutoff. All four combinations of <= and > are tested, with either A or B assigned to the AND region. The other category occupies its complement. This is one axis-aligned quadrant versus the remaining space, not an arbitrary rectangle or an XOR rule.

The conjunction search exhaustively tests distinct sample cutoff pairs, grouping tied coordinates together. It is an exact empirical optimum within this rule family, up to numerical precision; it does not use the straight-line angle grid. The angle-step control affects only the all-orientations straight-line search. Within a category, points are equally weighted; categories have equal weight in balanced accuracy.

Conjunctions are drawn as L-shaped boundary rays, with the AND region lightly shaded. The displayed formula, category mapping, and current accuracies define the rule even if a cutoff is outside the current plot view. Moving clouds leaves rules fixed; use Refit to optimize again. Save project retains conjunctions and group assignments.

Search cost grows with the product of the numbers of distinct frequency and angle values, so large samples can be slow. Progress and cancellation are supported. No points are subsampled.

Additional checks compared the conjunction optimizer to an independent brute-force enumeration across 40 sample sets with tied coordinates and unequal category sizes. Predicted classifications, cancellation, the three-rule comparison, and conjunction project save/load were also verified. Visual browser verification remains unavailable.
