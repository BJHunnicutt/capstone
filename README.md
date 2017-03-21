# TrialsViewer
[trialsviewer.com](http://trialsviewer.com/)
> TrialsViewer is an interactive visualization tool to explore clinical trial data - built for my capstone project at [Ada Developers Academy](adadevelopersacademy.org).  


### Built with:
  React/Redux, D3, & Victory.

### Motivation:

  Clinical trials are a necessary and important tool used to test whether new drugs and
  procedures are safe and effective. Since 2007, new trials have been [](https://www.gpo.gov/fdsys/pkg/PLAW-110publ85/pdf/PLAW-110publ85.pdf#page=82) required to register their intent and methods with the FDA, but this data has historically been difficult to access.
  The **[OpenTrials project](http://opentrials.net/)** is trying to change that by making registered trial data from around the world easily available to the public.

  **TrialsViewer** is an independently created tool to explore the data available through
  the [OpenTrials API](https://fda.opentrials.net/search) **\***. The goal is to create a summary that allows you to compare drugs or procedures for
  a given condition by highlighting two components:

1. **Gender**: Drugs regularly get approved without being tested on women, an "oversight" that can have life changing consequences. [It has been estimated that 8 out of 10 drugs pulled from the market by the FDA posed more of a threat for women.](https://www.drugwatch.com/featured/fda-let-women-down/)

2. **Publication Rates**: Trials with negative results are twice as likely to remain unreported as those with positive results, leading to [a misrepresentation of treatment efficacy.](http://www.nejm.org/doi/full/10.1056/NEJMsa065779#t=article)


* * *
  **\* IMPORTANT NOTE:** The OpenTrialsFDA API is only in its beta release, thus **_clinical trial data are currently incomplete_** on the 'Search' and 'Compare' pages. Check back or follow [@OpenTrials](https://twitter.com/opentrials) for updates!
