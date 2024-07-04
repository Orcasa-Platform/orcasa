# v12

- [Scientific Evidence] Break lines in the table cells of the detailed view of meta-analyses
- [Scientific Evidence] Improve the display of the interventions and values in the impact charts
- [Network] Display all the organisations in green in the diagram

# v11

- Send page view events to Matomo when navigating the platform
- Ability to opt-out of the Matomo analytics on the Personal data protection page
- Add the Google verification meta tag
- Address several Node.js vulnerabilities
  - As part of this change, Strapi has been upgraded to 4.24.4
- Allow easier access to debug information in the platform (`/api/log`)
- [Geospatial Data] Increase the map's maximum zoom level to 15
- [Scientific Evidence] Ability to go back to the first screen to see the total number of meta-analyses and primary studies
- [Scientific Evidence] Change the scale of the impact charts to -100% to 100%
  - Lines that overflow are displayed as discontinued past the extremities of the scale
- [Scientifice Evidence] Indicate the selected land use type in the sentence at the top of the results
- [Scientific Evidence] Address incorrect positive/negative signs in the tooltips of the impact charts
- [Scientific Evidence] Address an issue where the chart in the filters panel would appear empty
- [Scientific Evidence] Improve the layout of the detailed view on smaller desktop screens
- [Practices] Import the FAO data
- [Practices] Address inconsistent spacing on the detailed view
- [Practices] Add two new fields to the Practices model: `reviewed` (boolean) and `review_comments` (text)
  - `reviewed` defaults to `false` but is automatically set to `true` for all the existing practices
- [Network] Ability to filter the initiatives by land use type
- [Network] Display linked practices in the detailed views of the organisations and initiatives
- [Network] Display the top level organisation on a green background in the diagram



# v10

- [Scientific Evidence] Address an issue where the layout would be inconsistent when resizing the screen
- [Scientific Evidence] Address an issue where the “Reset all” button wouldn't reset all the filters
- [Scientific Evidence] Address an issue where the values of the filters would be based on the selected land use type
- [Scientific Evidence] Address an issue where the map wouldn't be updated when selecting a land use type
- [Scientific Evidence] Improve the consistency of the module compared to the others
- [Scientific Evidence] Indicate which filters apply to the map
- [Scientific Evidence] Improve the design of the map tooltips
- [Scientific Evidence] Display the land use types in bold in the title on top of the charts
- [Scientific Evidence] Display a tooltip to invite users to visit the Practices module
- [Practices] Display a tooltip to invite users to visit the Scientific Evidence module

# v9

- Remove “beta” from the platform
- Tweak the logo size and menu items alignment in the main navigation bar
- Address an issue where clickable emails would open the email composer window multiple times
- Address an issue where the logo wouldn't link to the homepage on the static pages
- Address multiple small layout issues on mobile
- Address an issue where the Strapi configuration (Config Sync plugin) may not be imported when deploying
- [Geospatial Data] Address an issue where the info buttons wouldn't be displayed correctly on Chrome-based browsers
- [Scientific Evidence] Redesign of the module
- [Practices] Display the detailed description and sub-interventions in the detailed view
- [Practices] Add a button to allow users to go back to the list view on mobile
- [Network] Indicate the status of the initiatives in the diagram
- [Network] Support URLs with path (e.g. https://www.naturefund.de/en) in the URL fields
- [Network] Highlight the buttons to create new organisations/initiatives
- [Network] Add a button to allow users to go back to the list view on mobile

**Breaking changes**:

- New mandatory variable, `window.MAPBOX_TOKEN`, inside `env.js` for Scientific Evidence ([details](https://github.com/Orcasa-Platform/orcasa-review4c?tab=readme-ov-file#installation))
- Removed environment variable: `IMPORT_STRAPI_CONFIG`

# v8

- Allow admins to manage the homepage's recommendation section
- [Practices] Give a time reference for the implementation decade field
- [Network] Remove the organisation/initiative ID from the template of the suggestion email
- [Network] Do not use the detailed description to perform keyword searches
- [Network] Order the organisations/initiatives by their relation and alphabetically in the diagram
- [Network] Modify the content of the initiative's tooltip on the map when viewing the details of an initiative
- [Network] Address an issue where the contact details of an initiative would appear twice on the detailed view
- [Network] Address an issue where the value of the multi-selection dropdowns could be overlapped by the down arrow icon

# v7

- Redesign of the platform (except Scientific Evidence)
- Responsive design for the whole platform (except Scientific Evidence)
- New style and technology for the map (except Scientific Evidence)
  - Updated satellite and light basemaps
  - Updated labels layer
  - New administrative boundaries layer
- Display attributions for the external layers visible on the map
- Add missing link to the email contact icon in the footer
- [Practices] Address an issue where practices would be filtered by default based on their main intervention

**Breaking changes**:

- New mandatory environment variable: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Removed environment variable: `NEXT_PUBLIC_ENABLE_RESPONSIVE`

# v6

- Allow admins to manage the homepage's testimonies
- Ability to configure the indexability of the platform through an environment variable
- [Practices] Integrate an initial sample of practices from FAO
- [Practices] Display the implementation decade if the implementation date is not available
- [Practices] Limit the length of the descriptions in the list view
- [Practices] Address an issue where the user couldn't filter the practices by country
- [Network] Support displaying incomplete URLs in the detailed view
- [Network] Address an issue where the map would be empty when viewing the details of an initiative
- [Network] Address visual glitches on the network diagram
- [Network] Address an issue where non-approved organisations and projects could be displayed on the map of the detailed view

# v5

- Ability to link organisations and practices
- Ability to link initiatives and practices
- Add metadata for search engines
- Enable Matomo analytics
- [Practices] Ability to link practices to multiple countries
- [Practices] Ability to filter the practices by publication year and source
- [Practices] Display the main intervention and land use types in the detailed view
- [Practices] Display the two-letter languages of a practice in uppercase
- [Network] Warn the user if they try to create an organisation/project that already exists
- [Network] Modify the contact details of the initiatives to only register a generic email or URL
- [Network] Disable unrelevant filters when only displaying organisations or initiatives
- [Datasets] Address an issue where the logos of the sources wouldn't be displayed

# v4

- Limit the zoom level of the maps to 13
- Display dynamic number of meta-analyses, initiatives, datasets and practices on the homepage
- [Geospatial Data] Ability to automatically zoom when a layer with highlighted bounds is toggled on
- [Scientific Evidence] Address an issue where the minimum zoom button could report an incorrect state
- [Scientific Evidence] Display data beyond -100% and 100% on the charts
- [Scientific Evidence] Address an issue on Firefox when the browser would navigate back on its own
- [Scientific Evidence] Explain that a publication can be displayed several times on the map
- [Practices] Display the total number of matching practices
- [Practices] Address an issue where the user couldn't filter by dates
- [Network] Display a warning if the user tries to leave an unsubmitted form
- [Network] Rename “projects” as “initiatives”
- [Network] Remove the “Worldwide” region of intervention
- [Network] Improve the legibility and interactivity of the network graph
- [Network] Allow simple formatting (new lines and lists) in the description of organisations and initiatives
- [Network] Display the name of the coordinating organisation in the initiative detail page
- [Network] Ability to add a description to the initiative types
- [Network] Ability to associate initiatives to land use types

# v3.1

- [Network] Improve configuration of email(s) receiving organisation/project suggestions notifications in the CMS

# v3

- Ability to modify the top description of each module in the CMS
- [Geospatial Data] Ability to get pixel information on the map
- [Practices] Prevent non-relevant practices from being displayed
- [Practices] Ability to filter the practices by main intervention and sub-intervention
- [Network] Ability to configure which email(s) receive organisation/project suggestions in the CMS
- [Network] Ability to configure the order of the organisation types and main thematics in the CMS
- [Network] Display the complete organisation type (“Other” type) on the detail view
- [Network] Allow projects to be linked to multiple sustainable development goals
- [Network] Prevent associating multiple times the same area of intervention to a project
- [Network] Prevent non-approved organisations and projects from being displayed
- [Network] Address an issue where organisation/project relations could be overwritten by non-approved organisations or projects
- [Network] New mandatory fields on the CMS:
  - Organization model (Organization type, Main organization theme, Country)
  - Project model (Project type, Lead partner, Country of coordination)
- [Network] Send a notification to admins (configurable in Strapi) when a new organisation/project is submitted
- [Network] Ability to filter projects by year (i.e. matching projects that were active on a specific year)
- [Network] Add the total number of matching organisations and projects at the top of the list
- [Network] Update the map's tooltips to improve their legibility
- [Network] Re-enable organisation/project creation on all environments
- [Network] Address an issue that could prevent modifying specific fields on the CMS
  - Practices model (language, land_use_has_changed, degradation_assessed)
- [Network] Update the configuration of the organisation form's tooltip to improve usability

# v2

- Enhancements on the homepage (animated stats, colors in the navigation menu)
- Indicate the new platform is a beta version
- New customizable Legal details and Personal data protection pages
- Add a favicon and template SEO metadata
- [Geospatial Data] New land cover layers
- [Geospatial Data] New Soils Revealed layers
- [Geospatial Data] [Documentation](https://docs.google.com/document/d/1pEMf8sH-CIM-ZK_bT1U810vBfqtgFw9SiBOO1VINHUU/edit?usp=sharing) of the layers configuration in Strapi
- [Scientific Evidence] New methodology dialog
- [Scientific Evidence] Rename publications as primary studies
- [Practices] Ability to see a list of practices extracted from WOCAT
- [Practices] Ability to see the detail view of a practice
- [Practices] Ability to see the practices on a map
- [Practices] Ability to search practices by keywords
- [Practices] Ability to filter the practices by country and land use type
- [Network] Ability to upload new projects
- [Network] Update the validation/required fields on the forms

# v1

- Update Strapi version to 4.15.5
- Update Client and CMS node.js versions to 20.10
- Update Client and CMS yarn versions to 4.0.2
- Change the date format on all the modules
- [Datasets] List of datasets
- [Datasets] Ability to search and filter datasets
- [Network] Ability to suggest changes to organisations and projects
- [Network] Ability to upload new organisations and associate projects to them
- [Network] Infinite scroll on the list of networks
